require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const ingredientRouter = require("./routes/ingredients.routes");
const recipeIngredientsRouter = require("./routes/recipe_ingredients.routes");
const foodStockItemRouter = require("./routes/food_stock_item.routes");
const foodStockItemsLogRouter = require("./routes/food_stock_items_log.routes");
const runRouter = require("./routes/run.routes");
const reservedDayPlansRouter = require("./routes/reserved_day_plans.routes");
const trainingRouter = require("./routes/training.routes");
const punchInRouter = require("./routes/punch_in.routes");
const staffShiftRouter = require("./routes/staff_shift.routes");
const notificationRouter = require("./routes/notifications.routes");

const app = express();

const port = 3000;
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/ingredient", ingredientRouter);
app.use("/recipe_ingredients", recipeIngredientsRouter);
app.use("/food_stock_item", foodStockItemRouter);
app.use("/food_stock_items_log", foodStockItemsLogRouter);
app.use("/run", runRouter);
app.use("/reserved_day_plans", reservedDayPlansRouter);
app.use("/training", trainingRouter);
app.use("/punch_in", punchInRouter);
app.use("/staff_shift", staffShiftRouter);
app.use("/notifications", notificationRouter);

mongoose.connect(
  "mongodb+srv://shreyashbdhamane0:F5lfRHs30KCTgNzO@cluster0.w8c16id.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ...`);
});
