const router = require("express").Router();

const {
  createReservedDayPlan,
  getAllReservedDayPlans,
  getReservedDayPlanByName,
  updateReservedDayPlan,
  clearReservedDayPlanByName,
} = require("../controllers/reserved_day_plans.controllers");

router.get("/", getAllReservedDayPlans);
router.get("/:name", getReservedDayPlanByName);
router.post("/", createReservedDayPlan);
router.put("/clearReservedDayPlanByName", clearReservedDayPlanByName);
router.put("/:name", updateReservedDayPlan);

module.exports = router;
