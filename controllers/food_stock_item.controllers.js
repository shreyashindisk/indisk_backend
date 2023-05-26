const FoodStockItem = require("../models/food_stock_item.models");
const { foodStockCreatedLog } = require("./food_stock_created_log.controllers");
const { create } = require("./food_stock_item_log.controllers");

const getAllFoodStockItems = async (req, res) => {
  try {
    var kitchen_name = null;

    if ("kitchen_type" in req.query) {
      kitchen_name = req.query.kitchen_type.toLowerCase();
    }
    if (kitchen_name == null) {
    } else if (kitchen_name.includes("central")) {
      kitchen_name = "central";
    } else if (kitchen_name.includes("sales")) {
      kitchen_name = "sales";
    }

    var findObj = {};
    if (kitchen_name == null) {
      findObj = {};
    } else {
      findObj = { kitchen_name: kitchen_name };
    }

    const foodStockItems = await FoodStockItem.find(findObj);
    res.status(200).json({ foodStockItems });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getFoodStockItemByName = async (req, res) => {
  try {
    const foodStockItem = await FoodStockItem.findOne({
      name: req.params.name,
    });
    res.status(200).json({ foodStockItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFoodStockItem = async (req, res) => {
  try {
    const foodStockItem = await FoodStockItem.create(req.body);
    res.status(201).json({ foodStockItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFoodStockItemFromApp = async (req, res) => {
  try {
    var {
      name,
      unit,
      preparations_time,
      cooking_time,
      content_per_single_item,
      min_stock_required_central,
      avl_qty_central,
      min_stock_required_sales,
      avl_qty_sales,
      image_url,
      preparations,
      priority,
      is_non_veg,
      min_stock_required_central_with,
      avl_qty_central_with,
      min_stock_required_central_without,
      avl_qty_central_without,
      min_stock_required_sales_with,
      avl_qty_sales_with,
      min_stock_required_sales_without,
      avl_qty_sales_without,
      non_veg_type,
    } = req.body;

    name = name.toLowerCase();
    unit = unit.toLowerCase();
    preparations_time = parseInt(preparations_time);
    cooking_time = parseInt(cooking_time);
    content_per_single_item = parseInt(content_per_single_item);
    min_stock_required_central = parseInt(min_stock_required_central);
    avl_qty_central = parseInt(avl_qty_central);
    min_stock_required_sales = parseInt(min_stock_required_sales);
    avl_qty_sales = parseInt(avl_qty_sales);
    image_url = image_url.toLowerCase();
    preparations = preparations.toLowerCase();
    priority = parseInt(priority);
    is_non_veg = is_non_veg.toLowerCase();
    min_stock_required_central_with = parseInt(min_stock_required_central_with);
    avl_qty_central_with = parseInt(avl_qty_central_with);
    min_stock_required_central_without = parseInt(
      min_stock_required_central_without
    );
    avl_qty_central_without = parseInt(avl_qty_central_without);
    min_stock_required_sales_with = parseInt(min_stock_required_sales_with);
    avl_qty_sales_with = parseInt(avl_qty_sales_with);
    min_stock_required_sales_without = parseInt(
      min_stock_required_sales_without
    );
    avl_qty_sales_without = parseInt(avl_qty_sales_without);
    non_veg_type = non_veg_type.toLowerCase();
    if (
      preparations != undefined &&
      preparations != null &&
      preparations != ""
    ) {
      preparations = preparations.split(",");
    } else {
      preparations = [];
    }
    var data;
    if (is_non_veg == "veg") {
      is_non_veg = false;
      data = await FoodStockItem.create([
        {
          name: name,
          kitchen_name: "central",
          unit: unit,
          available_qty: avl_qty_central,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_central,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
        {
          name: name,
          kitchen_name: "sales",
          unit: unit,
          available_qty: avl_qty_sales,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_sales,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
      ]);
    } else {
      data = await FoodStockItem.create([
        {
          name: name + " with " + non_veg_type,
          kitchen_name: "central",
          unit: unit,
          available_qty: avl_qty_central_with,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_central_with,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
        {
          name: name + " without " + non_veg_type,
          kitchen_name: "central",
          unit: unit,
          available_qty: avl_qty_central_without,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_central_without,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
        {
          name: name + " with " + non_veg_type,
          kitchen_name: "sales",
          unit: unit,
          available_qty: avl_qty_sales_with,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_sales_with,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
        {
          name: name + " without " + non_veg_type,
          kitchen_name: "sales",
          unit: unit,
          available_qty: avl_qty_sales_without,
          content_per_single_item: content_per_single_item,
          min_stock_required: min_stock_required_sales_without,
          preparations: preparations,
          time_unit: "min",
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          image_url: image_url,
        },
      ]);
    }

    if (!data) {
      return res.status(400).json({ message: "error" });
    }

    return res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFoodStockItem = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    var kitchen_type = req.body.kitchen_type.toLowerCase();
    const available_qty = parseInt(req.body.available_qty);
    if (kitchen_type.includes("central")) {
      kitchen_type = "central";
    } else if (kitchen_type.includes("sales")) {
      kitchen_type = "sales";
    }
    const foodStockItem = await FoodStockItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_type },
      { $set: { available_qty: available_qty } },
      { new: true }
    );
    res.status(200).json({ foodStockItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSomeFieldAndUpdateFoodStockItem = async (req, res) => {
  try {
    var {
      name,
      kitchen_name,
      min_stock_required,
      preparations,
      preparations_time,
      cooking_time,
      priority,
      time_unit,
    } = req.body;

    name = name.toLowerCase();
    kitchen_name = kitchen_name.toLowerCase();

    const foodStockItem = await FoodStockItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_name },
      {
        $set: {
          min_stock_required: min_stock_required,
          preparations: preparations,
          preparations_time: preparations_time,
          cooking_time: cooking_time,
          priority: priority,
          time_unit: time_unit,
        },
      },
      { new: true }
    );
    res.status(200).json({ foodStockItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addImageUrlToFoodStockItem = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    const kitchen_type = req.body.kitchen_name.toLowerCase();
    const image_url = req.body.image_url;
    const foodStockItem = await FoodStockItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_type },
      { $set: { image_url: image_url } },
      { new: true }
    );
    res.status(200).json({ foodStockItem });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFoodStockItemByName = async (req, res) => {
  try {
    var { name } = req.params;
    if (name) {
      name = name.toLowerCase();
    }

    const foodStockItem = await FoodStockItem.deleteMany({
      name: name,
    });
    if (!foodStockItem) {
      return res.status(404).json({ message: "Food Stock Item not found!" });
    }
    res.status(200).json({ message: "Food Stock Item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNameAndImageUrl = async (req, res) => {
  try {
    var kitchen_type = req.query.kitchen_type.toLowerCase();
    if (kitchen_type.includes("central")) {
      kitchen_type = "central";
    } else if (kitchen_type.includes("sales")) {
      kitchen_type = "sales";
    }
    const foodStockItems = await FoodStockItem.find(
      { kitchen_name: kitchen_type },
      { name: 1, image_url: 1 }
    );

    if (!foodStockItems) {
      return res.status(404).json({ message: "Food Stock Item not found!" });
    }
    res.status(200).json({ foodStockItems });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUsedAndMaintainLog = async (req, res) => {
  try {
    var { kitchen_type, food_stock_items } = req.body;

    kitchen_type = kitchen_type.toLowerCase();

    if (kitchen_type.includes("central")) {
      kitchen_type = "central";
    } else if (kitchen_type.includes("sales")) {
      kitchen_type = "sales";
    }

    create({ kitchen_name: kitchen_type, data: food_stock_items });

    const foodStockItems = await FoodStockItem.find(
      { kitchen_name: kitchen_type },
      { name: 1, available_qty: 1 }
    );
    var data = [];

    for (var i = 0; i < foodStockItems.length; i++) {
      for (var j = 0; j < food_stock_items.length; j++) {
        if (
          foodStockItems[i].name.toLowerCase() ==
          food_stock_items[j].name.toLowerCase()
        ) {
          var avl =
            foodStockItems[i].available_qty - food_stock_items[j].quantity;
          if (avl < 0) {
            avl = 0;
          }
          data.push({
            name: foodStockItems[i].name.toLowerCase(),
            available_qty: avl,
          });
        }
      }
    }

    for (var i = 0; i < data.length; i++) {
      await FoodStockItem.findOneAndUpdate(
        { name: data[i].name.toLowerCase(), kitchen_name: kitchen_type },
        { $set: { available_qty: data[i].available_qty } },
        { new: true }
      );
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createFoodStockAndCreateLog = async (req, res) => {
  try {
    var { food_stock_items } = req.body;
    //make lower case names imp,
    const centralItems = [];
    const salesItems = [];
    foodStockCreatedLog({ data: food_stock_items });

    for (var i = 0; i < food_stock_items.length; i++) {
      if ("central" in food_stock_items[i]) {
        centralItems.push({
          name: food_stock_items[i].name.trim().toLowerCase(),
          quantity: food_stock_items[i].central,
        });
      }
      if ("sales" in food_stock_items[i]) {
        salesItems.push({
          name: food_stock_items[i].name.trim().toLowerCase(),
          quantity: food_stock_items[i].sales,
        });
      }
    }

    const allFoodStockItems = await FoodStockItem.find(
      {},
      { name: 1, available_qty: 1, kitchen_name: 1 }
    );

    //separate central and sales from allFoodStockItems
    const centralFoodStockItems = [];
    const salesFoodStockItems = [];

    for (var i = 0; i < allFoodStockItems.length; i++) {
      if (allFoodStockItems[i].kitchen_name == "central") {
        centralFoodStockItems.push(allFoodStockItems[i]);
      } else if (allFoodStockItems[i].kitchen_name == "sales") {
        salesFoodStockItems.push(allFoodStockItems[i]);
      }
    }

    //update central

    for (var i = 0; i < centralItems.length; i++) {
      for (var j = 0; j < centralFoodStockItems.length; j++) {
        if (
          centralItems[i].name.toLowerCase() ==
          centralFoodStockItems[j].name.toLowerCase()
        ) {
          var avl =
            parseInt(centralFoodStockItems[j].available_qty) +
            parseInt(centralItems[i].quantity);
          await FoodStockItem.findOneAndUpdate(
            {
              name: centralItems[i].name.toLowerCase(),
              kitchen_name: "central",
            },
            { $set: { available_qty: avl } },
            { new: true }
          );
        }
      }
    }

    //update sales

    for (var i = 0; i < salesItems.length; i++) {
      for (var j = 0; j < salesFoodStockItems.length; j++) {
        if (
          salesItems[i].name.toLowerCase() ==
          salesFoodStockItems[j].name.toLowerCase()
        ) {
          var avl =
            parseInt(salesFoodStockItems[j].available_qty) +
            parseInt(salesItems[i].quantity);
          await FoodStockItem.findOneAndUpdate(
            {
              name: salesItems[i].name.toLowerCase(),
              kitchen_name: "sales",
            },
            { $set: { available_qty: avl } },
            { new: true }
          );
        }
      }
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNameAndImageUrl,
  getAllFoodStockItems,
  getFoodStockItemByName,
  createFoodStockItem,
  updateFoodStockItem,
  addSomeFieldAndUpdateFoodStockItem,
  addImageUrlToFoodStockItem,
  deleteFoodStockItemByName,
  createFoodStockItemFromApp,
  updateUsedAndMaintainLog,
  createFoodStockAndCreateLog,
};
