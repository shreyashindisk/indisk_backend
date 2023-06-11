const router = require("express").Router();
const { getUrgentTasks } = require("../controllers/urgent.controllers");

router.get("/", getUrgentTasks);

module.exports = router;
