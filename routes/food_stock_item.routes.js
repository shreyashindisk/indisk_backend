const router = require("express").Router();

const {
  getAllFoodStockItems,
  getFoodStockItemByName,
  createFoodStockItem,
  updateFoodStockItem,
  addSomeFieldAndUpdateFoodStockItem,
  addImageUrlToFoodStockItem,
  deleteFoodStockItemByName,
  createFoodStockItemFromApp,
  getAllNameAndImageUrl,
  updateUsedAndMaintainLog,
  createFoodStockAndCreateLog,
  updateImageAndSizeAndAvlQty,
} = require("../controllers/food_stock_item.controllers");

router.get("/", getAllFoodStockItems);
router.get("/name_and_image_url", getAllNameAndImageUrl);

router.get("/:name", getFoodStockItemByName);
router.post("/", createFoodStockItem);
router.post("/update_used", updateUsedAndMaintainLog);
router.post("/update_created_log", createFoodStockAndCreateLog);
router.post("/create", createFoodStockItemFromApp);

router.put("/addImageUrlToFoodStockItem", addImageUrlToFoodStockItem);
router.put("/updateImageAndSizeAndAvlQty", updateImageAndSizeAndAvlQty);
router.put("/:name", updateFoodStockItem);
router.put("/", addSomeFieldAndUpdateFoodStockItem);
router.delete("/:name", deleteFoodStockItemByName);

module.exports = router;
