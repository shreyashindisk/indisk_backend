const OpenShift = require("../models/open_shifts.models");
const User = require("../models/user.models");
const { sendNotification } = require("./push-notification.controllers");

const getMyNotifications = async (req, res) => {
  try {
    var { username, workingAt, userType } = req.query;

    if (userType != "manager" && (!username || !workingAt)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    username = username.trim();
    workingAt = workingAt.trim().toLowerCase();

    var centralOpenShifts = [];
    var salesOpenShifts = [];

    if (workingAt == "both" || userType == "manager") {
      const openShiftData = await OpenShift.find({
        laterUsernameForShift: null,
      });

      centralOpenShifts = openShiftData.filter(
        (shift) => shift.kitchen == "central"
      );
      salesOpenShifts = openShiftData.filter(
        (shift) => shift.kitchen == "sales"
      );
    } else if (workingAt == "central") {
      const openShiftData = await OpenShift.find({
        kitchen: "central",
        laterUsernameForShift: null,
      });

      centralOpenShifts = openShiftData;
    } else {
      const openShiftData = await OpenShift.find({
        kitchen: "sales",
        laterUsernameForShift: null,
      });

      salesOpenShifts = openShiftData;
    }

    //in centralOpenShifts and salesOpenShifts, we have all the open shifts,
    //now we need to remove the ones which were created by the same user only,

    centralOpenShifts = centralOpenShifts.filter(
      (shift) => shift.earlierUsernameForShift != username
    );

    salesOpenShifts = salesOpenShifts.filter(
      (shift) => shift.earlierUsernameForShift != username
    );

    var allOpenShifts = [];
    if (workingAt == "both" || userType == "manager") {
      allOpenShifts = centralOpenShifts.concat(salesOpenShifts);
    } else if (workingAt == "central") {
      allOpenShifts = centralOpenShifts;
    } else {
      allOpenShifts = salesOpenShifts;
    }

    return res.status(200).json({
      openShifts: allOpenShifts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const shiftsAvailableToTake = async (req, res) => {
  try {
    var { username, workingAt } = req.query;

    if (!username || !workingAt) {
      return res.status(400).json({ message: "Missing fields" });
    }

    username = username.trim();
    workingAt = workingAt.trim().toLowerCase();

    var centralOpenShifts = [];
    var salesOpenShifts = [];

    if (workingAt == "both") {
      const openShiftData = await OpenShift.find({
        laterUsernameForShift: null,
      });

      centralOpenShifts = openShiftData.filter(
        (shift) => shift.kitchen == "central"
      );
      salesOpenShifts = openShiftData.filter(
        (shift) => shift.kitchen == "sales"
      );
    } else if (workingAt == "central") {
      const openShiftData = await OpenShift.find({
        kitchen: "central",
        laterUsernameForShift: null,
      });

      centralOpenShifts = openShiftData;
    } else {
      const openShiftData = await OpenShift.find({
        kitchen: "sales",
        laterUsernameForShift: null,
      });

      salesOpenShifts = openShiftData;
    }

    //in centralOpenShifts and salesOpenShifts, we have all the open shifts,
    //now we need to remove the ones which were created by the same user only,

    centralOpenShifts = centralOpenShifts.filter(
      (shift) => shift.earlierUsernameForShift != username
    );

    salesOpenShifts = salesOpenShifts.filter(
      (shift) => shift.earlierUsernameForShift != username
    );

    var allOpenShifts = [];
    if (workingAt == "both") {
      allOpenShifts = centralOpenShifts.concat(salesOpenShifts);
    } else if (workingAt == "central") {
      allOpenShifts = centralOpenShifts;
    } else {
      allOpenShifts = salesOpenShifts;
    }

    return res.status(200).json({
      openShifts: allOpenShifts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const notifyMessageToUsers = async (req, res) => {
  try {
    var { message, users, username, kitchen } = req.body;

    if (!message || !users || !username) {
      return res.status(400).json({ message: "Missing fields" });
    }

    console.log(message, users, username, kitchen);

    if (kitchen.toLowerCase().includes("central")) {
      kitchen = "central";
    } else {
      kitchen = "sales";
    }

    message = message.trim();
    username = username.trim();
    var allMembers = false;

    for (var i = 0; i < users.length; i++) {
      users[i] = users[i].trim().toLowerCase();
      if (users[i] == "everyone") {
        allMembers = true;
      }
    }

    //get fcm token for all users, and send notification to all of them,

    var userTokens = [];
    if (allMembers) {
      const usersData = await User.find(
        {
          workingAt: kitchen,
        },
        {
          username: 1,
          fcm_token: 1,
        }
      );

      for (var i = 0; i < usersData.length; i++) {
        if (usersData[i].username != username) {
          userTokens.push(usersData[i].fcm_token);
        }
      }
    } else {
      const usersData = await User.find(
        {
          username: { $in: users },
        },
        {
          fcm_token: 1,
        }
      );
      for (var i = 0; i < usersData.length; i++) {
        userTokens.push(usersData[i].fcm_token);
      }
    }

    var nonNullTokens = [];

    for (var i = 0; i < userTokens.length; i++) {
      if (
        userTokens[i] != null &&
        userTokens[i] != undefined &&
        userTokens[i] != ""
      ) {
        nonNullTokens.push(userTokens[i]);
      }
    }

    //also send notification to the user who sent the message,
    const payload = {
      notification: {
        title: "Indisk: New Message",
        body: "You have a new message from " + username + ".",
      },
      data: {
        type: "message",
      },
    };

    if (nonNullTokens.length > 0) {
      sendNotification(nonNullTokens, payload);
    }

    return res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMyNotifications,
  shiftsAvailableToTake,
  notifyMessageToUsers,
};
