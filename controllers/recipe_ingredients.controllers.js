const Recipe = require("../models/recipe_ingredients.models");

const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecipeByName = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      name: req.params.name,
    });
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeByName,
};
