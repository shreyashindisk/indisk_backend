const StaffShift = require("../models/staff_shift.models");
const OpenShift = require("../models/open_shifts.models");
const User = require("../models/user.models");

const {
  weekDays,
  map,
  getDaysInMonthUTC,
  getDaysInMonthWithWeekdayUTC,
} = require("../constants/days");
const { sendNotification } = require("./push-notification.controllers");

const bookEntrieMonthFromWeekDay = async (req, res) => {
  try {
    var { month, year, day, timeSlotStaff, monthNumber, switchValue } =
      req.body;
    const dayNumber = map.get(day);
    if (month === "" || year === "" || day === "" || timeSlotStaff === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    console.log(switchValue);

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
        kitchen: switchValue === false ? "central" : "sales",
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
    var { date, kitchen } = req.query;
    if (date === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    var kitchenName = "";
    if (kitchen == "false") {
      kitchenName = "central";
    } else {
      kitchenName = "sales";
    }

    //getUtcdate
    var yyyymmdd = date.split(" ")[0];
    const dailyShift = await StaffShift.findOne({
      date: yyyymmdd,
      kitchen: kitchenName,
    });

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
    var { date, timeSlotStaff, kitchen } = req.body;
    if (date === "" || timeSlotStaff === "") {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    var kitchenName = "";
    if (kitchen == false) {
      kitchenName = "central";
    } else {
      kitchenName = "sales";
    }

    //getUtcdate
    var yyyymmdd = date.split(" ")[0];

    //update staff shift
    const data = await StaffShift.findOneAndUpdate(
      { date: yyyymmdd, kitchen: kitchenName },
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
        kitchen: kitchenName,
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
    var { username, kitchen } = req.query;
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

    // const timeSlotsStaffData = [];
    const timeSlotsStaffDataCentral = [];
    const timeSlotsStaffDataSales = [];

    if (kitchen == "central" || kitchen == "both") {
      for (var i = 0; i < weekList.length; i++) {
        const dataCentral = await StaffShift.findOne(
          {
            day: weekList[i],
            month: monthName,
            year: year,
            kitchen: "central",
          },
          { shift: 1, _id: 0 }
        );
        if (dataCentral !== null) {
          timeSlotsStaffDataCentral.push({
            day: weekList[i],
            shift: dataCentral.shift,
          });
        }
      }
    }

    if (kitchen == "sales" || kitchen == "both") {
      for (var i = 0; i < weekList.length; i++) {
        const dataSales = await StaffShift.findOne(
          {
            day: weekList[i],
            month: monthName,
            year: year,
            kitchen: "sales",
          },
          { shift: 1, _id: 0 }
        );

        if (dataSales !== null) {
          timeSlotsStaffDataSales.push({
            day: weekList[i],
            shift: dataSales.shift,
          });
        }
      }
    }

    // console.log(timeSlotsStaffData);

    // const mySchedule = {};
    const myScheduleCentral = {};
    const myScheduleSales = {};

    if (kitchen == "central" || kitchen == "both") {
      for (var i = 0; i < timeSlotsStaffDataCentral.length; i++) {
        const day = timeSlotsStaffDataCentral[i].day;
        const shift = timeSlotsStaffDataCentral[i].shift;
        if (shift !== null) {
          for (var j = 0; j < shift.length; j++) {
            const timeSlot = shift[j];
            const staff = timeSlot.staff.join(", ").toLowerCase();
            if (staff.includes(username.toLowerCase())) {
              if (myScheduleCentral[day] === undefined) {
                myScheduleCentral[day] = [];
              }
              myScheduleCentral[day].push(timeSlot.timeSlot);
            }
          }
        }
      }
    }
    if (kitchen == "sales" || kitchen == "both") {
      for (var i = 0; i < timeSlotsStaffDataSales.length; i++) {
        const day = timeSlotsStaffDataSales[i].day;
        const shift = timeSlotsStaffDataSales[i].shift;
        if (shift !== null) {
          for (var j = 0; j < shift.length; j++) {
            const timeSlot = shift[j];
            const staff = timeSlot.staff.join(", ").toLowerCase();
            if (staff.includes(username.toLowerCase())) {
              if (myScheduleSales[day] === undefined) {
                myScheduleSales[day] = [];
              }
              myScheduleSales[day].push(timeSlot.timeSlot);
            }
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

    //get all dates where i gave aaway my shift,
    const gaveAwayMyShift = await OpenShift.find({
      earlierUsernameForShift: username.toLowerCase(),
    });

    const centralGaveAwayMyShiftDateNumber = [];
    const salesGaveAwayMyShiftDateNumber = [];

    for (var i = 0; i < gaveAwayMyShift.length; i++) {
      const shift = gaveAwayMyShift[i];
      if (shift.kitchen === "central") {
        centralGaveAwayMyShiftDateNumber.push(parseInt(shift.day));
      } else {
        salesGaveAwayMyShiftDateNumber.push(parseInt(shift.day));
      }
    }

    const getTotalDaysInMonth = getDaysInMonthUTC(monthNumber, parseInt(year));

    // const myScheduleList = [];
    const myScheduleListCentral = [];
    const myScheduleListSales = [];
    //this are actual working dates, removing the gave away shifts,
    const centralWeekDayAndDates = [...weekDayAndDates];
    const salesWeekDayAndDates = [...weekDayAndDates];

    const centralGaveAwayDayAndDates = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    const salesGaveAwayDayAndDates = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    for (var i = 0; i < centralWeekDayAndDates.length; i++) {
      const day = centralWeekDayAndDates[i];
      const dates = day.dates;
      const newDates = dates.filter((date) => {
        if (!centralGaveAwayMyShiftDateNumber.includes(date)) {
          return date;
        } else {
          //add t0 centralGaveAwayDayAndDates, for respective day list
          centralGaveAwayDayAndDates[day.day.toLowerCase()].push(date);
        }
      });
      centralWeekDayAndDates[i].dates = newDates;
    }

    for (var i = 0; i < salesWeekDayAndDates.length; i++) {
      const day = salesWeekDayAndDates[i];
      const dates = day.dates;
      const newDates = dates.filter((date) => {
        if (!salesGaveAwayMyShiftDateNumber.includes(date)) {
          return date;
        } else {
          //add t0 salesGaveAwayDayAndDates, for respective day list
          salesGaveAwayDayAndDates[day.day.toLowerCase()].push(date);
        }
      });
      salesWeekDayAndDates[i].dates = newDates;
    }

    if (kitchen == "central" || kitchen == "both") {
      for (var day in myScheduleCentral) {
        const timeSlots = myScheduleCentral[day];
        const timeSlotsString = timeSlots.join(" To ");
        myScheduleListCentral.push({
          day: day,
          timeSlots: timeSlotsString,
          dates: centralWeekDayAndDates
            .find((element) => element.day === day)
            .dates.join(", "),
        });
      }
    }

    if (kitchen == "sales" || kitchen == "both") {
      for (var day in myScheduleSales) {
        const timeSlots = myScheduleSales[day];
        const timeSlotsString = timeSlots.join(" To ");
        myScheduleListSales.push({
          day: day,
          timeSlots: timeSlotsString,
          dates: salesWeekDayAndDates
            .find((element) => element.day === day)
            .dates.join(", "),
        });
      }
    }

    //get extra shifts taken by user, from open shifts,
    const extraShiftsTaken = await OpenShift.find({
      laterUsernameForShift: username.toLowerCase(),
    });

    const centralOpenShifts = [];
    const salesOpenShifts = [];

    for (var i = 0; i < extraShiftsTaken.length; i++) {
      const shift = extraShiftsTaken[i];
      if (shift.kitchen === "central") {
        centralOpenShifts.push(shift);
      } else {
        salesOpenShifts.push(shift);
      }
    }

    return res.status(200).send({
      myScheduleListCentral: myScheduleListCentral,
      myScheduleListSales: myScheduleListSales,
      centralOpenShifts: centralOpenShifts,
      salesOpenShifts: salesOpenShifts,
      totalDays: getTotalDaysInMonth.length,
      centralGaveAwayDayAndDates: centralGaveAwayDayAndDates,
      salesGaveAwayDayAndDates: salesGaveAwayDayAndDates,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while getting my schedule.",
    });
  }
};

const freeMyShift = async (req, res) => {
  try {
    var { username, date, month, kitchen } = req.body;

    const monthList = [
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

    const weekList = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (username === "" || date === "" || month === "") {
      throw new Error("Content can not be empty!");
    }

    username = username.trim();
    //get current year,
    const year = new Date().getFullYear().toString();
    const monthNumber = monthList.indexOf(month);

    const dateDate = new Date(Date.UTC(year, monthNumber, date));
    const dayName = weekList[dateDate.getDay()];
    var getTimeSlotDetails, getTimeSlotDetailsTwo;

    if (kitchen != "both") {
      getTimeSlotDetails = await StaffShift.findOne(
        {
          day: dayName,
          month: month,
          year: year,
          kitchen: kitchen,
        },
        { shift: 1, _id: 0 }
      );
    } else {
      getTimeSlotDetailsTwo = await StaffShift.find(
        {
          date: dateDate.toISOString().split("T")[0],
        },
        { shift: 1, kitchen: 1, _id: 0 }
      );
    }

    var myStartTime = "";
    var myEndTime = "";
    var actualKitchen = kitchen;
    if (kitchen != "both") {
      for (var i = 0; i < getTimeSlotDetails.shift.length; i++) {
        const timeSlot = getTimeSlotDetails.shift[i];
        const staff = timeSlot.staff.join(", ").toLowerCase();
        if (staff.includes(username.toLowerCase())) {
          if (myStartTime === "") {
            myStartTime = timeSlot.timeSlot;
          } else {
            myEndTime = timeSlot.timeSlot;
            break;
          }
        }
      }
    } else {
      for (var i = 0; i < getTimeSlotDetailsTwo.length; i++) {
        const getTimeSlotDetails = getTimeSlotDetailsTwo[i].shift;
        kitchen = getTimeSlotDetailsTwo[i].kitchen;
        for (var j = 0; j < getTimeSlotDetails.length; j++) {
          const staff = getTimeSlotDetails[j].staff.join(", ").toLowerCase();
          if (staff.includes(username.toLowerCase())) {
            if (myStartTime === "") {
              myStartTime = getTimeSlotDetails[j].timeSlot;
            } else {
              myEndTime = getTimeSlotDetails[j].timeSlot;
              break;
            }
          }
        }
      }
    }

    if (myStartTime === "" || myEndTime === "") {
      // throw new Error("You are not assigned to any shift on this day.");
      return;
    }

    await OpenShift.create({
      kitchen: kitchen,
      month: month,
      year: year,
      day: date,
      earlierUsernameForShift: username,
      timeSlot: myStartTime + " To " + myEndTime,
    });

    const allUsersNameAndfcmToken = await User.find(
      {
        workingAt: {
          $in: actualKitchen == "both" ? [kitchen, "both"] : [kitchen],
        },
      },
      { username: 1, fcm_token: 1, _id: 0 }
    );

    const manager = await User.findOne(
      {
        type: "manager",
      },
      {
        username: 1,
        fcm_token: 1,
      }
    );

    const allUsersNameAndfcmTokenExceptMe = allUsersNameAndfcmToken.filter(
      (user) => true
    );

    const allUsersWhoHaveFcmToken = allUsersNameAndfcmTokenExceptMe.filter(
      (user) =>
        user.fcm_token !== null &&
        user.fcm_token !== "" &&
        user.fcm_token !== undefined
    );

    const getAllFCMTokens = allUsersWhoHaveFcmToken.map(
      (user) => user.fcm_token
    );

    //addd manager fcm token
    if (
      manager.fcm_token !== null &&
      manager.fcm_token !== undefined &&
      manager.fcm_token !== ""
    ) {
      getAllFCMTokens.push(manager.fcm_token);
    }

    //send notification to all above tokens,
    const payload = {
      notification: {
        title: "Indisk: Shift Available",
        body: dayName + " " + date + ", " + month,
      },
      data: {
        type: "shift_available",
        username: username.toString(),
        date: date.toString(),
        dayName: dayName.toString(),
        month: month.toString(),
        year: year.toString(),
        myStartTime: myStartTime.toString(),
        myEndTime: myEndTime.toString(),
        kitchen: kitchen.toString(),
      },
    };

    if (getAllFCMTokens.length > 0) sendNotification(getAllFCMTokens, payload);

    return res.status(200).send({
      message: "Success.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while freeing my shift.",
    });
  }
};

const take_extra_shift = async (req, res) => {
  try {
    var {
      date,
      myEndTime,
      myStartTime,
      month,
      dayName,
      year,
      kitchen,
      username,
    } = req.body;
    const monthList = [
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

    username = username.trim();

    const data = await OpenShift.findOneAndUpdate(
      {
        day: date,
        month: month,
        year: year,
        timeSlot: myStartTime + " To " + myEndTime,
        kitchen: kitchen,
        laterUsernameForShift: null,
      },
      { laterUsernameForShift: username },
      { new: true }
    );

    if (data === null) {
      return res.status(204).send({
        message: "Shift already taken.",
      });
    }

    const earlierUsernameForShift = data.earlierUsernameForShift;
    const earlierUser = await User.findOne(
      {
        username: earlierUsernameForShift,
      },
      { username: 1, fcm_token: 1, _id: 0 }
    );

    //update time slot in staff shift, for that day, at that time,
    const monthNumber = monthList.indexOf(month);
    var yyyymmddDate;
    //get utc date
    const dateDate = new Date(Date.UTC(year, monthNumber, date));
    yyyymmddDate = dateDate.toISOString().split("T")[0];

    const staffShift = await StaffShift.findOne(
      {
        date: yyyymmddDate,
        day: dayName,
        month: month,
        year: year,
        kitchen: kitchen,
      },
      { shift: 1, _id: 0 }
    );

    //remove earlier user from staff shift, , add new user to staff shift
    const shiftArray = staffShift.shift;
    for (var i = 0; i < shiftArray.length; i++) {
      const singleShift = shiftArray[i];
      if (singleShift.timeSlot === myStartTime) {
        const staff = singleShift.staff;
        const index = staff.indexOf(earlierUsernameForShift);
        if (index > -1) {
          staff.splice(index, 1);
        }
        staff.push(username);
      }
      if (singleShift.timeSlot === myEndTime) {
        const staff = singleShift.staff;
        const index = staff.indexOf(earlierUsernameForShift);
        if (index > -1) {
          staff.splice(index, 1);
        }
        staff.push(username);
      }
    }

    //shiftChangedDetails is a strinf in the format of " earlierUsername To newUsername, myStartTime To myEndTime",
    const shiftChangedDetails =
      earlierUsernameForShift +
      " To " +
      username +
      ", " +
      myStartTime +
      " To " +
      myEndTime;
    await StaffShift.findOneAndUpdate(
      {
        date: yyyymmddDate,
        day: dayName,
        month: month,
        year: year,
        kitchen: kitchen,
      },
      {
        shift: shiftArray,
        $push: { shiftChangedDetails: shiftChangedDetails },
      },
      { new: true }
    );

    const manager = await User.findOne(
      {
        username: "prasad",
        type: "manager",
      },
      {
        username: 1,
        fcm_token: 1,
      }
    );

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    const payload = {
      notification: {
        title: "Indisk: Shift Taken",
        body:
          "Hi," +
          toTitleCase(earlierUser.username) +
          ", Your shift on " +
          dayName +
          ", " +
          date +
          " " +
          month +
          " has been taken by " +
          toTitleCase(username),
      },
      data: {
        type: "shift_taken",
        username: username.toString(),
      },
    };

    const tokens = [];
    if (
      earlierUser.fcm_token !== null &&
      earlierUser.fcm_token !== undefined &&
      earlierUser.fcm_token !== ""
    ) {
      tokens.push(earlierUser.fcm_token);
    }
    if (
      manager.fcm_token !== null &&
      manager.fcm_token !== undefined &&
      manager.fcm_token !== ""
    ) {
      tokens.push(manager.fcm_token);
    }

    if (tokens.length > 0) {
      sendNotification(tokens, payload);
    }

    return res.status(200).send({
      message: "Success.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message || "Some error occurred while taking extra shift.",
    });
  }
};

module.exports = {
  bookEntrieMonthFromWeekDay,
  getDailyShiftByDate,
  updateDailyShiftForParticularDay,
  getMySchedule,
  freeMyShift,
  take_extra_shift,
};
