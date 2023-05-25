const User = require("../models/user.models");

const register = async (req, res) => {
  try {
    var { type, username, password } = req.body;
    username = username.trim();
    password = password.trim();
    type = type.trim();
    const user = await User.create({ type, username, password });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  //there are two types manager and staff
  try {
    const { type, username, password } = req.body;

    //find all and print
    const users = await User.find({});

    const user = await User.find({
      type: type,
      username: username,
      password: password,
    });
    if (user.length > 0) {
      res.status(200).json({ user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
