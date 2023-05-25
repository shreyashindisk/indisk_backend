const mongoose = require("mongoose");

const recipeIngredientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  portions_you_make: {
    type: Number,
    required: true,
  },
  required_ingrediens: {
    type: Array,
    required: true,
  },
});

const RecipeIngredients = mongoose.model(
  "recipe_ingredients",
  recipeIngredientsSchema
);

module.exports = RecipeIngredients;
