const User = require("../models/user.models");

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

module.exports = { register, login };
