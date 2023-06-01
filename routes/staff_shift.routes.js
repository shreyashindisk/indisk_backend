const {
  bookEntrieMonthFromWeekDay,
  getDailyShiftByDate,
  updateDailyShiftForParticularDay,
  getMySchedule,
} = require("../controllers/staff_shift.controllers");

const router = require("express").Router();

// Create a new DailyShift
router.post("/weekday", bookEntrieMonthFromWeekDay);
router.get("/date", getDailyShiftByDate);
router.get("/my_schedule", getMySchedule);
router.put("/specific_day", updateDailyShiftForParticularDay);
module.exports = router;
