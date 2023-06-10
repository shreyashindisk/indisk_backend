const User = require("../models/user.models");
const { sendNotification } = require("./push-notification.controllers");

const register = async (req, res) => {
  try {
    var { username, password, kitchen, firstname, lastname, phone, email } =
      req.body;
    var type = "staff";
    username = username.trim();
    password = password.trim();
    workingAt = kitchen.trim().toLowerCase();
    firstname = firstname.trim().toLowerCase();
    lastname = lastname.trim().toLowerCase();
    phone = phone.trim().toLowerCase();
    email = email.trim().toLowerCase();
    type = type.trim().toLowerCase();

    const user = await User.create({
      username,
      password,
      workingAt,
      firstname,
      lastname,
      phone,
      email,
      type,
    });

    // var mailOptions = {
    //   from: "indiskbackend@gmail",
    //   to: email,
    //   subject: "Welcome to Indisk",
    //   text: `Hi ${firstname} ${lastname},\n\nWelcome to Indisk. You have been registered as a staff member. You can now login to the app using the following credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nRegards,\nIndisk Team`,
    // };

    // google disabled the feature to send emails from nodemailer. So, I am commenting this out for now.
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });

    res.status(201).json("User created successfully.");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists." });
    }
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  //there are two types manager and staff
  try {
    var { type, username, password } = req.body;

    username = username.trim();
    password = password.trim();

    const user = await User.findOne({
      type: type,
      username: username,
      password: password,
    });

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFcm = async (req, res) => {
  try {
    var { fcm_token, username } = req.body;
    username = username.trim();
    fcm_token = fcm_token.trim();

    //find user and update,

    await User.findOneAndUpdate(
      { username: username },
      { fcm_token: fcm_token },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUsernames = async (req, res) => {
  try {
    const users = await User.find(
      {
        type: "staff",
      },
      { workingAt: 1, username: 1, _id: 0 }
    );

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    var { username, workingAt } = req.body;
    username = username.trim();
    workingAt = workingAt.trim();

    const user = await User.findOneAndUpdate(
      {
        username: username,
        workingAt: workingAt,
      },
      {
        type: "deleted",
        fcm_token: "",
      }
    );

    const payload = {
      notification: {
        title: "Indisk: Important Notification",
        body: "You have important notification from the manager.",
      },
      data: {
        type: "account_deleted",
      },
    };

    if (user) {
      try {
        if (user.fcm_token) {
          sendNotification(user.fcm_token, payload);
        }
      } catch (err) {
        console.log(err);
      }
      return res.status(204).json({ message: "User deleted successfully." });
    } else {
      res.status(400).json({ message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, updateFcm, getAllUsernames, deleteUser };
