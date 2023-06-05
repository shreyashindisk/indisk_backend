const { parse } = require("dotenv");
const PunchInLog = require("../models/punch_in_log.models.js");
const WorkingHours = require("../models/working_hours.models.js");
// Create and Save a new PunchInLog
const punchIn = async (req, res) => {
  try {
    var { username, timestamp, workingAt, workingAtOriginal } = req.body;
    username = username.trim();

    if (username === "" || timestamp == null) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

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

    var year = timestamp.split("-")[0];
    var month = parseInt(timestamp.split("-")[1]);
    month = month - 1;
    month = monthList[month];

    //create puch in log
    const punchInLog = new PunchInLog({
      year: year,
      month: month,
      username: username,
      workingAt: workingAt,
      workingAtOriginal: workingAtOriginal,
      punch_in_time: timestamp,
    });
    // Save PunchInLog in the database
    await punchInLog.save();

    res.status(201).send({
      message: "PunchInLog was created successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message:
        e.message || "Some error occurred while creating the PunchInLog.",
    });
  }
};

const punchOut = async (req, res) => {
  try {
    var { username, timestamp } = req.body;
    username = username.trim();

    if (username === "" || timestamp === null) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    //create puch in log, here update the one log with username and null punchout time,

    const data = await PunchInLog.findOneAndUpdate(
      { username: username, punch_out_time: null },
      { punch_out_time: timestamp },
      { new: true }
    );

    //get the working mins from punch in and punch out time
    try {
      var date = data.punch_in_time.toISOString().split("T")[0];
      var punchInTime = new Date(data.punch_in_time);
      var punchOutTime = new Date(data.punch_out_time);
      var workingHoursInMins = (punchOutTime - punchInTime) / 60000;
      const workingHoursObject = {
        date: date,
        username: username,
        month: data.month,
        year: data.year,
        workingAt: data.workingAt,
        workingAtOriginal: data.workingAtOriginal,
        workingHoursInMins: Math.ceil(workingHoursInMins),
      };
      //create working hours log
      const workingHours = new WorkingHours(workingHoursObject);
      // Save WorkingHours in the database
      await workingHours.save();
      //create punch out log
    } catch (e) {
      console.log(e);
    }

    res.status(201).send({
      message: "PunchOutLog was created successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message:
        e.message || "Some error occurred while creating the PunchOutLog.",
    });
  }
};

const getAllPunchInLogs = async (req, res) => {
  try {
    const punchInLogs = await PunchInLog.find();
    res.status(punchInLogs.length > 0 ? 200 : 204).send(punchInLogs);
  } catch (e) {
    res.status(500).send({
      message:
        e.message || "Some error occurred while retrieving punch in logs.",
    });
  }
};

module.exports = {
  punchIn,
  punchOut,
  getAllPunchInLogs,
};
