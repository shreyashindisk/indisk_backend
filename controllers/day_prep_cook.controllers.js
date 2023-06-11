const { get } = require("mongoose");
const FoodStockItem = require("../models/food_stock_item.models");
const ReservedDayPlans = require("../models/reserved_day_plans.models");

const getAllFoodStockItems = async () => {
  try {
    const kitchen_name = "central";
    const foodStockItems = await FoodStockItem.find({
      kitchen_name: kitchen_name,
    });
    return foodStockItems;
  } catch (error) {
    throw error;
  }
};

const findBelowRequirementFoodItems = async () => {
  try {
    const FoodStockItems = await getAllFoodStockItems();
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

const findNamesOfBelowRequirementFoodItemsNames = async () => {
  try {
    const belowRequirementFoodItems = await FoodStockItem.find(
      {},
      {
        name: 1,
        min_stock_required: 1,
        available_qty: 1,
      }
    );
    const belowRequirementFoodItemsNames = [];
    belowRequirementFoodItems.forEach((item) => {
      const recipeName = removeSuffixFromString(item.name);
      if (
        item.available_qty < item.min_stock_required &&
        belowRequirementFoodItemsNames.includes(recipeName) == false
      ) {
        belowRequirementFoodItemsNames.push(recipeName);
      }
    });

    return belowRequirementFoodItemsNames;
  } catch (error) {
    throw error;
  }
};

const findBelowRequirementFoodItemsExt = async (req, res) => {
  try {
    const FoodStockItems = await getAllFoodStockItems();
    const belowRequirementFoodItems = [];
    FoodStockItems.forEach((item) => {
      if (item.name.includes("with")) {
        if (item.name.includes("without")) {
          if (item.available_qty < item.min_stock_required) {
            belowRequirementFoodItems.push(item);
            console.log(item);
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
    const nameAndAvailableQtyMinStockRequired = [];
    belowRequirementFoodItems.forEach((item) => {
      const recipeName = removeSuffixFromString(item.name);
      if (recipeNames.includes(recipeName)) {
        return;
      } else {
        belowRequirementFoodItemsExt.push({
          name: recipeName,
          preparations: item.preparations,
          time_unit: item.time_unit,
          preparations_time: item.preparations_time,
          cooking_time: item.cooking_time,
          priority: item.priority,
          unit: item.unit,
          available_qty: item.available_qty,
          content_per_single_item: item.content_per_single_item,
          min_stock_required: item.min_stock_required,
          kitchen_name: item.kitchen_name,
        });
        recipeNames.push(recipeName);
      }
    });
    const final = await finalData(belowRequirementFoodItemsExt);
    console.log(final);
    return res.status(200).json(final);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const finalData = async (belowRequirementFoodItemsExt) => {
  try {
    var temp = [];
    //calling for each item to mongoose db is not good call once for all as we need all data anyways
    const allFoodStockItems = await getAllFoodStockItems(
      {},
      { name: 1, min_stock_required: 1, available_qty: 1 }
    );
    belowRequirementFoodItemsExt.forEach((item) => {
      var withMinStockRequired = 0;
      var withoutMinStockRequired = 0;
      var withAvailableQty = 0;
      var withoutAvailableQty = 0;
      const name = item.name;
      allFoodStockItems.forEach((item2) => {
        if (item2.name.includes(name)) {
          //order of without matters here
          if (item2.name.includes("without")) {
            withoutMinStockRequired = item2.min_stock_required;
            withoutAvailableQty = item2.available_qty;
          } else {
            withMinStockRequired = item2.min_stock_required;
            withAvailableQty = item2.available_qty;
          }
        }
      });

      temp.push({
        ...item,
        withMinStockRequired: withMinStockRequired,
        withoutMinStockRequired: withoutMinStockRequired,
        withAvailableQty: withAvailableQty,
        withoutAvailableQty: withoutAvailableQty,
      });
    });
    return temp;
  } catch (error) {
    throw error;
  }
};

const prioritizeFoodItemsToCook = async () => {
  try {
    const belowRequirementFoodItems = await findBelowRequirementFoodItems();
    const prioritizedFoodItemsToCook = [];
    const topPriorityFoodItems = [];
    const mediumPriorityFoodItems = [];
    const lowPriorityFoodItems = [];
    belowRequirementFoodItems.forEach((item) => {
      if (item.priority == 3) {
        topPriorityFoodItems.push(item);
      } else if (item.priority == 2) {
        mediumPriorityFoodItems.push(item);
      } else {
        lowPriorityFoodItems.push(item);
      }
    });

    const bCtemp = [];
    const nonBc = [];
    topPriorityFoodItems.forEach((item) => {
      if (item.name.includes("butter chicken")) {
        bCtemp.push(item);
      } else {
        nonBc.push(item);
      }
    });

    prioritizedFoodItemsToCook.push(bCtemp);
    prioritizedFoodItemsToCook.push(nonBc);
    prioritizedFoodItemsToCook.push(mediumPriorityFoodItems);
    prioritizedFoodItemsToCook.push(lowPriorityFoodItems);

    return prioritizedFoodItemsToCook;
  } catch (error) {
    throw error;
  }
};

const getAllReservedDayPlans = async () => {
  try {
    const reservedDayPlans = await ReservedDayPlans.find({});
    return reservedDayPlans;
  } catch (error) {
    throw error;
  }
};

const getFreeDays = async () => {
  try {
    const reservedDayPlans = await getAllReservedDayPlans();
    const availableDaysToCook = [];
    reservedDayPlans.forEach((item) => {
      if (item.tasks.length == 0) {
        availableDaysToCook.push(item.day);
      }
    });

    const orderDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const orderedAvailableDaysToCook = [];
    orderDays.forEach((item) => {
      if (availableDaysToCook.includes(item)) {
        orderedAvailableDaysToCook.push(item);
      }
    });

    const nonAvailableDaysToCook = [];
    orderDays.forEach((item) => {
      if (!availableDaysToCook.includes(item)) {
        nonAvailableDaysToCook.push(item);
      }
    });

    //create a map where day name is assigned with a number
    const map = new Map();
    for (var i = 0; i < orderDays.length; i++) {
      map.set(orderDays[i], i);
    }

    const jointStringFromArray = orderedAvailableDaysToCook.join(" ");
    var todaysDay = getTodaysDay();

    //here basic logic is to get next available day to cook
    while (nonAvailableDaysToCook.includes(todaysDay)) {
      if (todaysDay == "sunday") {
        todaysDay = "monday";
      } else {
        todaysDay = orderDays[map.get(todaysDay) + 1];
      }
    }

    const splitString = jointStringFromArray.split(" " + todaysDay + " ");
    const finalString = todaysDay + " " + splitString[1] + " " + splitString[0];
    const finalArray = finalString.split(" ");

    return finalArray;
  } catch (error) {
    throw error;
  }
};

const getTodaysDay = () => {
  //day from which cooking can be started
  try {
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    const hour = new Date().getHours();

    if (hour > 11) {
      return weekdays[(today + 1) % weekdays.length];
    }

    return weekdays[today];
  } catch (error) {
    throw error;
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

const preReservedDaysPlans = async () => {
  try {
    const reservedDayPlans = await getAllReservedDayPlans();
    const preReservedDays = [];
    reservedDayPlans.forEach((item) => {
      if (item.tasks.length != 0) {
        preReservedDays.push({
          day: item.day,
          prepTasks: item.tasks,
          cookTasks: [],
        });
      }
    });
    return preReservedDays;
  } catch (error) {
    throw error;
  }
};

const getDayPrepAndCook = async (req, res) => {
  const isPrepDoneForRecipeItem = (prepTasks, recipeName) => {
    for (var i = 0; i < prepTasks.length; i++) {
      if (prepTasks[i].name == recipeName) {
        return false;
      }
    }
    return true;
  };

  try {
    const prioritizedFoodItemsToCookData = await prioritizeFoodItemsToCook();
    var availableDaysToCook = await getFreeDays();

    var prepTasks = [];
    var cookTasks = [];
    const recipeNames = [];
    const assignedDaysAndTasks = [];
    const availableMinsDaily = 300;

    prioritizedFoodItemsToCookData.forEach((item) => {
      item.forEach((item2) => {
        const recipeName = removeSuffixFromString(item2.name);
        if (recipeNames.includes(recipeName)) {
          return;
        } else {
          prepTasks.push({
            name: recipeName,
            preparations: item2.preparations,
            time_unit: item2.time_unit,
            preparations_time: item2.preparations_time,
          });
          cookTasks.push({
            name: recipeName,
            cooking_time: item2.cooking_time,
            time_unit: item2.time_unit,
          });
          recipeNames.push(recipeName);
        }
      });
    });

    availableDaysToCook.forEach((item) => {
      var minsLeft = availableMinsDaily;
      var prepTasksForDay = [];
      var cookTasksForDay = [];

      var assignedDayAndTasks = {
        day: item,
      };
      for (var i = 0; i < cookTasks.length; i++) {
        const recipeName = cookTasks[i].name;

        if (!isPrepDoneForRecipeItem(prepTasks, recipeName)) {
          if (
            i < prepTasks.length &&
            minsLeft >= prepTasks[i].preparations_time
          ) {
            prepTasksForDay.push(prepTasks[i]);
            minsLeft -= prepTasks[i].preparations_time;
            if (minsLeft >= cookTasks[i].cooking_time) {
              cookTasksForDay.push(cookTasks[i]);
              minsLeft -= cookTasks[i].cooking_time;
            }
          }
        } else {
          if (minsLeft >= cookTasks[i].cooking_time) {
            cookTasksForDay.push(cookTasks[i]);
            minsLeft -= cookTasks[i].cooking_time;
          }
        }
      }
      const tempPrepTasks = [];
      const tempCookTasks = [];
      for (var i = 0; i < prepTasks.length; i++) {
        for (var j = 0; j < prepTasksForDay.length; j++) {
          if (prepTasks[i].name == prepTasksForDay[j].name) {
            break;
          }

          if (j == prepTasksForDay.length - 1) {
            tempPrepTasks.push(prepTasks[i]);
          }
        }
      }

      for (var i = 0; i < cookTasks.length; i++) {
        for (var j = 0; j < cookTasksForDay.length; j++) {
          if (cookTasks[i].name == cookTasksForDay[j].name) {
            break;
          }

          if (j == cookTasksForDay.length - 1) {
            tempCookTasks.push(cookTasks[i]);
          }
        }
      }

      prepTasks = tempPrepTasks;
      cookTasks = tempCookTasks;

      assignedDayAndTasks.prepTasks = prepTasksForDay;
      assignedDayAndTasks.cookTasks = cookTasksForDay;
      assignedDaysAndTasks.push(assignedDayAndTasks);
    });

    const preReservedDaysPlan = await preReservedDaysPlans();
    const allTasks = [...assignedDaysAndTasks, ...preReservedDaysPlan];

    //sort allTasks from monday to sunday
    const orderDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const orderedAllTasks = [];
    orderDays.forEach((item) => {
      for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].day == item) {
          orderedAllTasks.push(allTasks[i]);
          break;
        }
      }
    });

    return res.status(200).json(orderedAllTasks);
  } catch (error) {
    console.log("error");
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDayPrepAndCook,
  findBelowRequirementFoodItemsExt,
  findNamesOfBelowRequirementFoodItemsNames,
};
