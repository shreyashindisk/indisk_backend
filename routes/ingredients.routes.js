const router = require("express").Router();
const {
  getAllIngredientItems,
  getIngredientItemByName,
  createIngredientItem,
  updateIngredientItem,
  deleteIngredientItemByName,
  getAllIngredientAndAddFieldAndUpdate,
  addBarcodeNumberToIngredientItem,
  addImageUrlToIngredientItem,
  updateMinStockRequiredFieldForAllIngredients,
  updateMinStockRequired,
  shoppingList,
  updateSupplierName,
  ingredientDetailUpdate,
  createIngredientItemFromApp,
  findMissingItemFromSales,
  findAllItemsWithouSupplierName,
} = require("../controllers/ingredient.controllers");

router.get("/", getAllIngredientItems);
router.get("/findAllItemsWithouSupplierName", findAllItemsWithouSupplierName);
router.get("/test", findMissingItemFromSales);
router.get("/shoppingList", shoppingList);
router.get("/:name", getIngredientItemByName);
router.post("/", createIngredientItem);
router.post("/create", createIngredientItemFromApp);
router.post(
  "/getAllIngredientAndAddFieldAndUpdate",
  getAllIngredientAndAddFieldAndUpdate
);
router.put(
  "/addBarcodeNumberToIngredientItem",
  addBarcodeNumberToIngredientItem
);
router.put("/addImageUrlToIngredientItem", addImageUrlToIngredientItem);
router.put(
  "/updateMinStockRequiredFieldForAllIngredients",
  updateMinStockRequiredFieldForAllIngredients
);
router.put("/ingredientDetailUpdate", ingredientDetailUpdate);
router.put("/updateMinStockRequired", updateMinStockRequired);
router.put("/updateSupplierName", updateSupplierName);
router.put("/:name", updateIngredientItem);
router.delete("/:name", deleteIngredientItemByName);

module.exports = router;
