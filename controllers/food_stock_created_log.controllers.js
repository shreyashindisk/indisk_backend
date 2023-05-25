const FoodStockItemsCreatedLog = require("../models/food_stock_created_log.models");

const foodStockCreatedLog = async (data) => {
  try {
    const foodStockItemsCreatedLog = new FoodStockItemsCreatedLog({
      data: data.data,
    });
    await foodStockItemsCreatedLog.save();
  } catch (error) {
    console.log("error in file food_stock_created_log.controllers.js");
    console.log(error);
  }
};

module.exports = {
  foodStockCreatedLog,
};
