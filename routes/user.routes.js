const router = require("express").Router();
const {
  login,
  register,
  updateFcm,
  getAllUsernames,
  deleteUser,
} = require("../controllers/user.controllers");

router.post("/register", register);
router.post("/login", login);
router.put("/fcm_token", updateFcm);
router.get("/usernames", getAllUsernames);
router.delete("/", deleteUser);

module.exports = router;
