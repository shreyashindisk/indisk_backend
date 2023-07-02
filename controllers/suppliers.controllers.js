const Supplier = require("../models/suppliers.models");

//get suppleirs, create suppliers, delete suppliers,

//get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create a supplier
const createSupplier = async (req, res) => {
  try {
    var { name } = req.body;
    name = name.toLowerCase().trim();
    const supplier = await Supplier.create({ name });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    var name = req.params.name;
    name = name.toLowerCase().trim();
    const supplier = await Supplier.findOneAndDelete({ name });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  deleteSupplier,
};
