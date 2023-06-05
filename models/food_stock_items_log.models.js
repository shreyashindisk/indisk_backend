const mongoose = require("mongoose");
//this is for used food stock items log,
const foodStockItemsLogSchema = new mongoose.Schema(
  {
    kitchen_name: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  }
  // { timestamps: true }
);

const FoodStockItemsLog = mongoose.model(
  "food_stock_items_log",
  foodStockItemsLogSchema
);

module.exports = FoodStockItemsLog;
