const { parse } = require("dotenv");
const IngredientItem = require("../models/ingredient_item.models");
const {
  findNamesOfBelowRequirementFoodItemsNames,
} = require("../controllers/day_prep_cook.controllers");
const RecipeIngredients = require("../models/recipe_ingredients.models");

const getAllIngredientItems = async (req, res) => {
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

    var ingredientItems = await IngredientItem.find(findObj);

    const itemsWithBarcode = [];
    const itemsWithoutBarcode = [];

    ingredientItems.forEach((item) => {
      if (item.barcode_number == undefined || item.barcode_number == "") {
        itemsWithoutBarcode.push(item);
      } else {
        itemsWithBarcode.push(item);
      }
    });

    ingredientItems = itemsWithoutBarcode.concat(itemsWithBarcode);

    res.status(200).json({ ingredientItems });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getIngredientItemByName = async (req, res) => {
  try {
    const ingredientItem = await IngredientItem.findOne({
      name: req.params.name.toLowerCase(),
    });
    res.status(200).json({ ingredientItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllIngredientAndAddFieldAndUpdate = async (req, res) => {
  try {
    const ingredientItems = await IngredientItem.find({});
    ingredientItems.forEach(async (item) => {
      const ingredientItem = await IngredientItem.findOneAndUpdate(
        { name: item.name.toLowerCase() },
        { $set: { kitchen_name: "sales" } },
        { new: true }
      );
      ingredientItem.save();
      const newIngredientItem = {
        name: ingredientItem.name.toLowerCase(),
        kitchen_name: "central",
        unit: ingredientItem.unit,
        available_qty: ingredientItem.available_qty,
        content_per_single_item: ingredientItem.content_per_single_item,
      };
      const newIngredientItem2 = await IngredientItem.create(newIngredientItem);
      newIngredientItem2.save();
    });
    res.status(200).json({ ingredientItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIngredientItem = async (req, res) => {
  try {
    const ingredientItem = await IngredientItem.create(req.body);
    res.status(201).json({ ingredientItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIngredientItemFromApp = async (req, res) => {
  try {
    var {
      name,
      unit,
      content_per_single_item,
      price_per_single_item,
      supplier_name,
      barcode_number,
      image_url,
      min_stock_required_central,
      avl_qty_central,
      min_stock_required_sales,
      avl_qty_sales,
    } = req.body;

    //convert evything to lowercase
    name = name.toLowerCase();
    unit = unit.toLowerCase();
    supplier_name = supplier_name.toLowerCase();
    barcode_number = barcode_number.toLowerCase();

    const ingredientItem = await IngredientItem.create({
      name: name,
      kitchen_name: "central",
      unit: unit,
      available_qty: avl_qty_central,
      min_stock_required: min_stock_required_central,
      content_per_single_item: content_per_single_item,
      price_per_single_item: price_per_single_item,
      supplier_name: supplier_name,
      barcode_number: barcode_number,
      image_url: image_url,
    });
    ingredientItem.save();
    const ingredientItem2 = await IngredientItem.create({
      name: name,
      kitchen_name: "sales",
      unit: unit,
      available_qty: avl_qty_sales,
      min_stock_required: min_stock_required_sales,
      content_per_single_item: content_per_single_item,
      price_per_single_item: price_per_single_item,
      supplier_name: supplier_name,
      barcode_number: barcode_number,
      image_url: image_url,
    });
    ingredientItem2.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIngredientItem = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    var kitchen_type = req.body.kitchen_type.toLowerCase();
    const quantity = parseInt(req.body.quantity);
    if (kitchen_type.includes("central")) {
      kitchen_type = "central";
    } else if (kitchen_type.includes("sales")) {
      kitchen_type = "sales";
    }
    const ingredientItem = await IngredientItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_type },
      { $set: { available_qty: quantity } },
      { new: true }
    );
    res.status(200).json({ ingredientItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIngredientItemByName = async (req, res) => {
  try {
    var { name } = req.params;
    if (name) {
      name = name.toLowerCase();
    }
    const deleted = await IngredientItem.deleteMany({
      name: name,
    });
    if (deleted) {
      return res.status(200).send("Ingredient item deleted");
    }
    return res.status(404).send("Ingredient item not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBarcodeNumberToIngredientItem = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    const kitchen_name = req.body.kitchen_name.toLowerCase();
    const barcode_number = req.body.barcode_number;
    const ingredientItem = await IngredientItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_name },
      { $set: { barcode_number: barcode_number } },
      { new: true }
    );
    ingredientItem.save();
    res.status(200).json({ ingredientItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addImageUrlToIngredientItem = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();
    const kitchen_name = req.body.kitchen_name.toLowerCase();
    const image_url = req.body.image_url;
    const ingredientItem = await IngredientItem.findOneAndUpdate(
      { name: name, kitchen_name: kitchen_name },
      { $set: { image_url: image_url } },
      { new: true }
    );
    ingredientItem.save();
    res.status(200).json({ ingredientItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMinStockRequiredFieldForAllIngredients = async (req, res) => {
  try {
    const ingredientItems = await IngredientItem.find({});
    ingredientItems.forEach(async (item) => {
      const ingredientItem = await IngredientItem.findOneAndUpdate(
        { name: item.name.toLowerCase() },
        { $set: { min_stock_required: 0 } },
        { new: true }
      );
      ingredientItem.save();
    });
    res.status(200).json({ ingredientItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const shoppingList = async (req, res) => {
  try {
    const ingredientItems = await IngredientItem.find({});
    const shoppingList = [];
    const centralShoppingList = [];
    const salesShoppingList = [];
    const ingredientNames = [];
    ingredientItems.forEach((item) => {
      if (!ingredientNames.includes(item.name.toLowerCase())) {
        ingredientNames.push(item.name.toLowerCase());
      }
      if (item.available_qty < item.min_stock_required) {
        shoppingList.push(item);
        if (item.kitchen_name.toLowerCase() == "central") {
          centralShoppingList.push(item);
        } else {
          salesShoppingList.push(item);
        }
      }
    });

    const updatedShoppingList = [];
    ingredientNames.forEach((name) => {
      var centralMinStockRequired = 0;
      var salesMinStockRequired = 0;
      var centralAvailableQty = 0;
      var salesAvailableQty = 0;
      var shopItem;
      shoppingList.forEach((item) => {
        if (item.name.toLowerCase() == name.toLowerCase()) {
          shopItem = {
            name: item.name.toLowerCase(),
            kitchen_name: item.kitchen_name.toLowerCase(),
            unit: item.unit,
            content_per_single_item: item.content_per_single_item,
            available_qty: item.available_qty,
            barcode_number: item.barcode_number,
            image_url: item.image_url,
            supplier_name: item.supplier_name.toLowerCase(),
          };
          if (item.kitchen_name == "central") {
            centralMinStockRequired = item.min_stock_required;
            centralAvailableQty = item.available_qty;
          } else {
            salesMinStockRequired = item.min_stock_required;
            salesAvailableQty = item.available_qty;
          }
        }
      });
      if (shopItem != null) {
        if (centralMinStockRequired > 0) {
          shopItem["centralMinStockRequired"] = centralMinStockRequired;
          shopItem["centralAvailableQty"] = centralAvailableQty;
        }
        if (salesMinStockRequired > 0) {
          shopItem["salesMinStockRequired"] = salesMinStockRequired;
          shopItem["salesAvailableQty"] = salesAvailableQty;
        }
        updatedShoppingList.push(shopItem);
      }
    });

    const supplierNames = await getAllSupplierNames();
    //segregate shopping list by supplier, only for updatedShoppingList
    const segregatedShoppingList = [];
    supplierNames.forEach((supplierName) => {
      const supplierShoppingList = [];
      updatedShoppingList.forEach((item) => {
        if (item.supplier_name && item.supplier_name.includes(supplierName)) {
          supplierShoppingList.push(item);
        }
      });
      if (supplierShoppingList.length > 0) {
        segregatedShoppingList.push({
          supplierName: supplierName,
          shoppingList: supplierShoppingList,
        });
      }
    });

    // const namesOfBelowRequirementFoodItems =
    //   await findNamesOfBelowRequirementFoodItemsNames();
    // console.log(namesOfBelowRequirementFoodItems);

    // const recipeIngredientsDetails = RecipeIngredients.find({});
    // const recipeIngredients = [];

    res.status(200).json({
      segregatedShoppingList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMinStockRequired = async (req, res) => {
  try {
    const data = await IngredientItem.updateMany(
      {},
      { $set: { min_stock_required: 5 } },
      { new: true }
    );
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplierName = async (req, res) => {
  try {
    const { name, supplier_name } = req.body;
    const data = await IngredientItem.updateMany(
      { name: name.toLowerCase() },
      { supplier_name: supplier_name.toLowerCase() },
      { new: true }
    );
    if (data.nModified == 0) {
      res.status(404).json({ message: "Ingredient item not found" });
    }
    res.status(200).json({ name, supplier_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ingredientDetailUpdate = async (req, res) => {
  try {
    var {
      item_name,
      quantity,
      kitchen_type,
      content_per_single_item,
      barcode_number,
      min_stock_required,
      supplier_name,
    } = req.body;

    item_name = item_name.toLowerCase();
    kitchen_type = kitchen_type.split(" ")[0].toLowerCase();
    supplier_name = supplier_name.toLowerCase();

    const data = await IngredientItem.findOneAndUpdate(
      { name: item_name, kitchen_name: kitchen_type },
      {
        $set: {
          available_qty: quantity,

          min_stock_required: min_stock_required,
        },
      },
      { new: true }
    );
    await IngredientItem.updateMany(
      { name: item_name },
      {
        $set: {
          content_per_single_item: content_per_single_item,
          barcode_number: barcode_number,
          supplier_name: supplier_name,
        },
      },
      { new: true }
    );

    if (data == null) {
      return res.status(404).json({ message: "Ingredient item not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllSupplierNames = async () => {
  try {
    const ingredientItems = await IngredientItem.find({}, { supplier_name: 1 });
    const supplierNames = [];
    ingredientItems.forEach((item) => {
      if (item.supplier_name && !supplierNames.includes(item.supplier_name)) {
        if (
          item.supplier_name != undefined &&
          item.supplier_name.includes(" or ")
        ) {
          const names = item.supplier_name.split(" or ");
          names.forEach((name) => {
            if (!supplierNames.includes(name)) {
              supplierNames.push(name);
            }
          });
        } else if (item.supplier_name != undefined) {
          supplierNames.push(item.supplier_name);
        }
      }
    });
    return supplierNames;
  } catch (error) {
    console.log("error");
    console.log(error);
    return [];
  }
};

const findMissingItemFromSales = async (req, res) => {
  try {
    const ingredientItems = await IngredientItem.find(
      {},
      { name: 1, kitchen_name: 1 }
    );
    const centralItems = [];
    const salesItems = [];

    ingredientItems.forEach((item) => {
      if (item.kitchen_name == "central") {
        centralItems.push(item.name);
      } else {
        salesItems.push(item.name);
      }
    });

    const missingItems = [];
    centralItems.forEach((item) => {
      if (!salesItems.includes(item)) {
        missingItems.push(item);
      }
    });

    res.status(200).json({ missingItems });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const findAllItemsWithouSupplierName = async (req, res) => {
  try {
    const ingredientItems = await IngredientItem.find(
      { kitchen_name: "central" },
      { name: 1, supplier_name: 1 }
    );
    const itemsWithoutSupplierName = [];
    ingredientItems.forEach((item) => {
      if (
        item.supplier_name == undefined ||
        item.supplier_name == "" ||
        item.supplier_name == " " ||
        item.supplier_name == "." ||
        item.supplier_name == null ||
        item.supplier_name == "null" ||
        item.supplier_name == "NULL" ||
        item.supplier_name == "Null" ||
        item.supplier_name == "none" ||
        item.supplier_name == "None" ||
        item.supplier_name == "NONE" ||
        item.supplier_name == "None" ||
        item.supplier_name == "N/A" ||
        item.supplier_name == "n/a" ||
        item.supplier_name == "N/a" ||
        item.supplier_name == "n/A" ||
        item.supplier_name == "na" ||
        item.supplier_name == "Na" ||
        item.supplier_name == "NA" ||
        item.supplier_name == "nA" ||
        item.supplier_name == "not available" ||
        item.supplier_name == "Not given" ||
        item.supplier_name == "Not Given" ||
        item.supplier_name == "not given"
      ) {
        itemsWithoutSupplierName.push(item.name);
      }
    });
    res.status(200).json({ itemsWithoutSupplierName });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllIngredientItems,
  getIngredientItemByName,
  createIngredientItem,
  updateIngredientItem,
  deleteIngredientItemByName,
  getAllIngredientAndAddFieldAndUpdate,
  addBarcodeNumberToIngredientItem,
  addImageUrlToIngredientItem,
  updateMinStockRequiredFieldForAllIngredients,
  shoppingList,
  updateMinStockRequired,
  updateSupplierName,
  ingredientDetailUpdate,
  createIngredientItemFromApp,
  findMissingItemFromSales,
  findAllItemsWithouSupplierName,
};
