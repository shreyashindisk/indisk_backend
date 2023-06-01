const StaffShift = require("../models/staff_shift.models");
const {
  weekDays,
  map,
  getDaysInMonthUTC,
  getDaysInMonthWithWeekdayUTC,
} = require("../constants/days");

const bookEntrieMonthFromWeekDay = async (req, res) => {
  try {
    var { month, year, day, timeSlotStaff, monthNumber } = req.body;
    const dayNumber = map.get(day);
    if (month === "" || year === "" || day === "" || timeSlotStaff === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    //for all the particular days of the month, add this staff to the shift
    //find all dates in this month and year that are the same day as the day in the request
    //add the staff to the shift array
    //save the staff shift

    //get all the dates in the month and year that are the same day as the day in the request
    const dates = getDaysInMonthWithWeekdayUTC(
      monthNumber - 1, //month is 0 indexed
      year,
      dayNumber //day is 0 indexed
    );
    //for each date, add the staff to the shift array
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const shift = timeSlotStaff;

      //create staff shift
      const staffShift = new StaffShift({
        date: date.toISOString().split("T")[0],
        day: day,
        month: month,
        year: year,
        shift: shift,
      });
      // Save StaffShift in the database
      await staffShift.save();
    }

    return res.status(200).send({
      message: "Success.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message:
        e.message || "Some error occurred while booking shift from week day.",
    });
  }
};

const getDailyShiftByDate = async (req, res) => {
  try {
    var { date } = req.query;
    if (date === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    //getUtcdate
    var yyyymmdd = date.split(" ")[0];
    const dailyShift = await StaffShift.findOne({ date: yyyymmdd });

    if (dailyShift === null) {
      return res.status(200).send({
        data: [],
      });
    } else {
      return res.status(200).send({
        data: dailyShift.shift,
      });
    }

    // return res.status(200).send({
    //   data: dailyShift,
    // });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while getting daily shift.",
    });
  }
};

const updateDailyShiftForParticularDay = async (req, res) => {
  try {
    var { date, timeSlotStaff } = req.body;
    if (date === "" || timeSlotStaff === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    //getUtcdate
    var yyyymmdd = date.split(" ")[0];

    //update staff shift
    const data = await StaffShift.findOneAndUpdate(
      { date: yyyymmdd },
      { shift: timeSlotStaff },
      { new: true }
    );

    if (data === null) {
      //create staff shift
      const staffShift = new StaffShift({
        date: yyyymmdd,
        day: weekDays[new Date(date).getDay()],
        month: new Date(date).toLocaleString("default", { month: "long" }),
        year: new Date(date).getFullYear(),
        shift: timeSlotStaff,
      });
      // Save StaffShift in the database
      await staffShift.save();
    }

    return res.status(200).send({
      message: "Success.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while updating daily shift.",
    });
  }
};

const getMySchedule = async (req, res) => {
  try {
    var { username } = req.query;
    if (username === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    username = username.trim();

    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date();
    let monthName = month[d.getUTCMonth()];
    let year = d.getUTCFullYear().toString();
    const weekList = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    //we want to gather check in and check out times for each day of the week for current month of the year, for current user,

    const timeSlotsStaffData = [];

    for (var i = 0; i < weekList.length; i++) {
      const data = await StaffShift.findOne(
        {
          day: weekList[i],
          month: monthName,
          year: year,
        },
        { shift: 1, _id: 0 }
      );
      if (data !== null) {
        timeSlotsStaffData.push({ day: weekList[i], shift: data.shift });
      }
    }

    // console.log(timeSlotsStaffData);

    const mySchedule = {};

    for (var i = 0; i < timeSlotsStaffData.length; i++) {
      const day = timeSlotsStaffData[i].day;
      const shift = timeSlotsStaffData[i].shift;
      if (shift !== null) {
        for (var j = 0; j < shift.length; j++) {
          const timeSlot = shift[j];
          if (timeSlot.staff.includes(username)) {
            if (mySchedule[day] === undefined) {
              mySchedule[day] = [];
            }
            mySchedule[day].push(timeSlot.timeSlot);
          }
        }
      }
    }
    // traverse the map,
    // for each day,
    const monthNumber = d.getUTCMonth();
    const weekDayAndDates = [];

    for (var i = 0; i < weekList.length; i++) {
      const dates = getDaysInMonthWithWeekdayUTC(
        monthNumber, //month is 0 indexed
        parseInt(year),
        i //day is 0 indexed
      );
      const getAllDayNumberOfMonthFromDates = [];
      for (var j = 0; j < dates.length; j++) {
        const date = dates[j];
        getAllDayNumberOfMonthFromDates.push(date.getUTCDate());
      }
      weekDayAndDates.push({
        day: weekList[i],
        dates: getAllDayNumberOfMonthFromDates,
      });
    }

    const getTotalDaysInMonth = getDaysInMonthUTC(monthNumber, parseInt(year));

    const myScheduleList = [];
    for (var day in mySchedule) {
      const timeSlots = mySchedule[day];
      const timeSlotsString = timeSlots.join(" To ");
      myScheduleList.push({
        day: day,
        timeSlots: timeSlotsString,
        dates: weekDayAndDates
          .find((element) => element.day === day)
          .dates.join(", "),
      });
    }

    //get all dates for each weekday in given month,

    return res
      .status(200)
      .send({
        myScheduleList: myScheduleList,
        totalDays: getTotalDaysInMonth.length,
      });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while getting my schedule.",
    });
  }
};

module.exports = {
  bookEntrieMonthFromWeekDay,
  getDailyShiftByDate,
  updateDailyShiftForParticularDay,
  getMySchedule,
};
