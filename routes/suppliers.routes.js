const {
  getAllSuppliers,
  createSupplier,
  deleteSupplier,
} = require("../controllers/suppliers.controllers");

const router = require("express").Router();

//get all suppliers
router.get("/", getAllSuppliers);

//create a supplier
router.post("/", createSupplier);

//delete a supplier
router.delete("/:name", deleteSupplier);

module.exports = router;
