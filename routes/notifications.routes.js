const {
  getMyNotifications,
  shiftsAvailableToTake,
  notifyMessageToUsers,
} = require("../controllers/notifications.controllers");
const router = require("express").Router();

router.get("/", getMyNotifications);
router.get("/shifts_available", shiftsAvailableToTake);
router.post("/message", notifyMessageToUsers);

module.exports = router;
