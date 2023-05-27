const User = require("../models/user.models");

const register = async (req, res) => {
  try {
    var { type, username, password, workingAt } = req.body;
    username = username.trim();
    password = password.trim();
    workingAt = workingAt.trim().toLowerCase();
    type = type.trim().toLowerCase();
    const user = await User.create({ type, username, password, workingAt });
    res.status(201).json({ user });
  } catch (error) {
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
