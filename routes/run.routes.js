const router = require("express").Router();

const {
  getDayPrepAndCook,
  findBelowRequirementFoodItemsExt,
} = require("../controllers/day_prep_cook.controllers");
const {
  getFixedDaysAndTasksInOrder,
} = require("../controllers/reserved_day_plans.controllers");

router.get("/day_prep_cook", getDayPrepAndCook);
router.get("/cooking_requirements", findBelowRequirementFoodItemsExt);
router.get("/days_and_tasks", getFixedDaysAndTasksInOrder);

module.exports = router;
