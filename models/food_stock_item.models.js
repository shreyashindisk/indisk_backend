const mongoose = require("mongoose");

const foodStockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kitchen_name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  available_qty: {
    type: Number,
    required: true,
  },
  content_per_single_item: {
    type: Number,
    required: true,
  },
  min_stock_required: {
    type: Number,
    required: true,
  },
  preparations: {
    type: Array,
    required: true,
  },
  time_unit: {
    type: String,
    required: true,
  },
  preparations_time: {
    type: Number,
    required: true,
  },
  cooking_time: {
    type: Number,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    required: false,
  },
});

const FoodStockItem = mongoose.model("food_stock_item", foodStockItemSchema);

module.exports = FoodStockItem;
