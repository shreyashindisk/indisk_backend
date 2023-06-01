const PunchInLog = require("../models/punch_in_log.models.js");

// Create and Save a new PunchInLog
const punchIn = async (req, res) => {
  try {
    var { username, timestamp } = req.body;
    username = username.trim();

    if (username === "" || timestamp == null) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    //create puch in log
    const punchInLog = new PunchInLog({
      username: username,
      punch_in_time: timestamp,
    });
    // Save PunchInLog in the database
    await punchInLog.save();

    res.status(201).send({
      message: "PunchInLog was created successfully!",
    });
  } catch (e) {
    res.status(500).send({
      message:
        e.message || "Some error occurred while creating the PunchInLog.",
    });
  }
};

const punchOut = async (req, res) => {
  try {
    var { username, punch_in_time, timestamp } = req.body;
    username = username.trim();

    if (username === "" || timestamp === null) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    //create puch in log, here update the one log with username and null punchout time,

    await PunchInLog.findOneAndUpdate(
      { username: username, punch_out_time: null },
      { punch_out_time: timestamp },
      { new: true }
    );

    res.status(201).send({
      message: "PunchOutLog was created successfully!",
    });
  } catch (e) {
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
