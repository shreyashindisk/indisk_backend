const FoodStockItemLog = require("../models/food_stock_items_log.models.js");

const create = async (body) => {
  try {
    var { kitchen_name, data } = body;

    //convert to lowercase
    kitchen_name = kitchen_name.toLowerCase();

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
