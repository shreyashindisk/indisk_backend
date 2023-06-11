const FoodStockItem = require("../models/food_stock_item.models");

const getUrgentTasks = async (req, res) => {
  try {
    var { usertype } = req.query;
    usertype = usertype.toLowerCase();
    var urgentTasks = [];
    if (usertype == "manager") {
      var salesTransfer = await findBelowRequirementFoodItemsExt();
      var cookingReq = await findBelowRequirementFoodItemsCooking();
      if (salesTransfer.length > 0) {
        urgentTasks.push({
          name: "Delivery To Sales Kitchen",
          data: salesTransfer,
        });
      }
      if (cookingReq.length > 0) {
        urgentTasks.push({
          name: "Cooking Needed",
          data: cookingReq,
        });
      }
    }
    var addChicken = await findBelowRequirementFoodItemsExtWithout();
    if (addChicken.length > 0) {
      urgentTasks.push({
        name: "Meat Addition",
        data: addChicken,
      });
    }

    res.status(200).json(urgentTasks);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
    });
  }
};

const removeSuffixFromString = (string) => {
  try {
    if (string.includes(" with chicken")) {
      return string.replace(" with chicken", "");
    } else if (string.includes(" without chicken")) {
      return string.replace(" without chicken", "");
    } else if (string.includes(" with beef")) {
      return string.replace(" with beef", "");
    } else if (string.includes(" without beef")) {
      return string.replace(" without beef", "");
    } else {
      return string;
    }
  } catch (error) {
    throw error;
  }
};

const getAllFoodStockItems = async (kitchen) => {
  try {
    const kitchen_name = kitchen;
    const foodStockItems = await FoodStockItem.find(
      {
        kitchen_name: kitchen_name,
      },
      {
        name: 1,
        min_stock_required: 1,
        available_qty: 1,
        shifting_constant: 1,
      }
    );
    return foodStockItems;
  } catch (error) {
    throw error;
  }
};

const findBelowRequirementFoodItemsExt = async () => {
  try {
    const FoodStockItems = await getAllFoodStockItems("sales");
    const belowRequirementFoodItems = [];
    FoodStockItems.forEach((item) => {
      if (item.name.includes("with")) {
        if (item.name.includes("without")) {
          if (item.available_qty < item.min_stock_required) {
            belowRequirementFoodItems.push(item);
          }
        }
      } else {
        if (item.available_qty < item.min_stock_required) {
          belowRequirementFoodItems.push(item);
        }
      }
    });

    return belowRequirementFoodItems;
  } catch (error) {
    throw error;
  }
};

const findBelowRequirementFoodItemsExtWithout = async () => {
  try {
    const FoodStockItems = await getAllFoodStockItems("sales");
    const belowRequirementFoodItems = [];
    FoodStockItems.forEach((item) => {
      if (item.name.includes(" with ")) {
        if (item.available_qty < item.min_stock_required) {
          belowRequirementFoodItems.push(item);
        }
      }
    });

    return belowRequirementFoodItems;
  } catch (error) {
    throw error;
  }
};

const findBelowRequirementFoodItemsCooking = async () => {
  try {
    const FoodStockItems = await getAllFoodStockItems("central");
    const belowRequirementFoodItems = [];
    FoodStockItems.forEach((item) => {
      if (item.name.includes("with")) {
        if (item.name.includes("without")) {
          if (item.available_qty < item.min_stock_required) {
            belowRequirementFoodItems.push(item);
          }
        }
      } else {
        if (item.available_qty < item.min_stock_required) {
          belowRequirementFoodItems.push(item);
        }
      }
    });

    //only 1 for with and without chicken consider

    const recipeNames = [];
    const belowRequirementFoodItemsExt = [];
    belowRequirementFoodItems.forEach((item) => {
      const recipeName = removeSuffixFromString(item.name);
      if (recipeNames.includes(recipeName)) {
        return;
      } else {
        belowRequirementFoodItemsExt.push({
          name: recipeName,
          available_qty: item.available_qty,
          min_stock_required: item.min_stock_required,
        });
        recipeNames.push(recipeName);
      }
    });

    return belowRequirementFoodItemsExt;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUrgentTasks,
};
