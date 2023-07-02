const router = require("express").Router();

const getCronData = async (req, res) => {
  res.status(200).json({ message: "Cron job is running." });
};

router.get("/", getCronData);

module.exports = router;
