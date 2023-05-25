const mongoose = require("mongoose");

const ingredientItemSchema = new mongoose.Schema({
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
    required: false,
    default: 0,
  },
  min_stock_required: {
    type: Number,
    required: false,
    default: 0,
  },
  content_per_single_item: {
    type: Number,
    required: true,
  },
  price_per_single_item: {
    type: Number,
    required: false,
  },
  supplier_name: {
    type: String,
    required: false,
  },
  barcode_number: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
  },
});

const IngredientItem = mongoose.model("ingredient_item", ingredientItemSchema);

module.exports = IngredientItem;
