const router = require("express").Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeByName,
} = require("../controllers/recipe_ingredients.controllers");

router.get("/", getAllRecipes);
router.get("/:name", getRecipeByName);
router.post("/", createRecipe);

module.exports = router;
