const mongoose = require("mongoose");
//this is for used food stock items log,
const foodStockItemsCreatedLogSchema = new mongoose.Schema(
  {
    data: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const FoodStockItemsCreatedLog = mongoose.model(
  "food_stock_items_created_log",
  foodStockItemsCreatedLogSchema
);

module.exports = FoodStockItemsCreatedLog;
