const router = require("express").Router();
const { login, register } = require("../controllers/user.controllers");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
