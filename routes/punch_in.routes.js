const {
  punchIn,
  punchOut,
  getAllPunchInLogs,
} = require("../controllers/punch_in_log.controllers");

const router = require("express").Router();

// Create a new PunchInLog
router.post("/", punchIn);

// Create a new PunchOutLog
router.put("/", punchOut);

// Retrieve all PunchInLogs
router.get("/", getAllPunchInLogs);

module.exports = router;
