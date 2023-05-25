const FoodStockItemLog = require("../models/food_stock_items_log.models.js");

const create = async (body) => {
  try {
    const { kitchen_name, data } = body;
    const foodStockItemLog = new FoodStockItemLog({
      kitchen_name,
      data,
    });
    await foodStockItemLog.save();
  } catch (error) {
    console.log("error in file food_stock_item_log.controllers.js");
    console.log(error);
  }
};

module.exports = {
  create,
};
