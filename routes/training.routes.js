const router = require("express").Router();

const {
  createTraining,
  getAllTrainings,
  deleteByName,
} = require("../controllers/training.controllers");

router.get("/", getAllTrainings);
router.post("/", createTraining);
router.delete("/", deleteByName);

module.exports = router;
