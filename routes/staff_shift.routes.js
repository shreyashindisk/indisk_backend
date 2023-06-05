const {
  freeMyShift,
  bookEntrieMonthFromWeekDay,
  getDailyShiftByDate,
  updateDailyShiftForParticularDay,
  getMySchedule,
  take_extra_shift,
  getAllWorkingHours,
} = require("../controllers/staff_shift.controllers");

const router = require("express").Router();

// Create a new DailyShift
router.post("/free_my_shift", freeMyShift);
router.post("/weekday", bookEntrieMonthFromWeekDay);
router.get("/date", getDailyShiftByDate);
router.get("/my_schedule", getMySchedule);
router.get("/working_hours", getAllWorkingHours);
router.put("/specific_day", updateDailyShiftForParticularDay);
router.put("/take_extra_shift", take_extra_shift);

module.exports = router;
