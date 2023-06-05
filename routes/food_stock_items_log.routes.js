const router = require("express").Router();
const {
  getAllFoodStockItemLogsForMonth,
} = require("../controllers/food_stock_item_log.controllers");

router.get("/month_data", getAllFoodStockItemLogsForMonth);

module.exports = router;
