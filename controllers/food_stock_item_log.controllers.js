const FoodStockItemLog = require("../models/food_stock_items_log.models.js");
const { monthList } = require("../constants/days.js");
const create = async (body) => {
  try {
    var { kitchen_name, data } = body;

    var date = new Date();
    var month = date.getMonth();
    month = monthList[month];
    var year = date.getFullYear();
    date = date.toISOString().split("T")[0];

    //convert to lowercase
    kitchen_name = kitchen_name.toLowerCase();

    const foodStockItemLog = new FoodStockItemLog({
      kitchen_name,
      data,
      month,
      year,
      date,
    });
    await foodStockItemLog.save();
  } catch (error) {
    console.log("error in file food_stock_item_log.controllers.js");
    console.log(error);
  }
};
const getAllFoodStockItemLogsForMonth = async (req, res) => {
  try {
    var { date } = req.query;
    var month = date.split("-")[1];
    var year = date.split("-")[0];
    month = monthList[parseInt(month) - 1];

    const foodStockItemLogs = await FoodStockItemLog.find({
      month,
      year,
    });

    //go throught the array and find the kitchen name and data,
    //then go thorught the data, and create a map to store which item was used how many times,
    //just go thorugh all data items and find the quantity used and add all, and save in a map, or object,
    //then go through the map and create an array of objects, with name and quantity used,
    //then send the array of objects as response
    var centralMap = new Map();
    var salesMap = new Map();

    foodStockItemLogs.forEach((foodStockItemLog) => {
      var { kitchen_name, data } = foodStockItemLog;
      data.forEach((item) => {
        var { name, quantity } = item;
        var quantity_used = parseInt(quantity);
        if (kitchen_name === "central") {
          if (centralMap.has(name)) {
            var prevQuantity = centralMap.get(name);
            centralMap.set(name, prevQuantity + quantity_used);
          } else {
            centralMap.set(name, quantity_used);
          }
        } else if (kitchen_name === "sales") {
          if (salesMap.has(name)) {
            var prevQuantity = salesMap.get(name);
            salesMap.set(name, prevQuantity + quantity_used);
          } else {
            salesMap.set(name, quantity_used);
          }
        }
      });
    });

    var centralArray = [];
    var salesArray = [];

    centralMap.forEach((value, key) => {
      var str = key;
      var matches = str.match(/\b(\w)/g);
      var acronym = matches.join("");

      centralArray.push({
        name: acronym.toUpperCase(),
        quantity_used: value,
      });
    });

    salesMap.forEach((value, key) => {
      //butter chicken => bc
      var str = key;
      var matches = str.match(/\b(\w)/g);
      var acronym = matches.join("");
      salesArray.push({
        name: acronym.toUpperCase(),
        quantity_used: value,
      });
    });

    res.status(200).send({
      central: centralArray,
      sales: salesArray,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message:
        e.message ||
        "Some error occurred while retrieving food stock item logs.",
    });
  }
};
module.exports = {
  create,
  getAllFoodStockItemLogsForMonth,
};
