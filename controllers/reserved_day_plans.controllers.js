const ReservedDayPlans = require("../models/reserved_day_plans.models");

const createReservedDayPlan = async (req, res) => {
  try {
    const { day, tasks } = req.body;
    var isHoliday = false;
    if ("isHoliday" in req.body) {
      isHoliday = req.body.isHoliday;
    }
    const reservedDayPlan = await ReservedDayPlans.create({
      day: day.toLowerCase(),
      tasks: tasks,
      isHoliday: isHoliday,
    });

    res.status(201).json({ reservedDayPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReservedDayPlans = async (req, res) => {
  try {
    const reservedDayPlans = await ReservedDayPlans.find({});
    res.status(200).json({ reservedDayPlans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFixedDaysAndTasksInOrder = async (req, res) => {
  try {
    const orderDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const reservedDayPlans = await ReservedDayPlans.find({});
    var fixedDaysAndTasksInOrder = [];

    //tasks in order from monday to sunday are pushed into fixedDaysAndTasksInOrder. so in flutter no need to srt, just use the index of the day

    for (var i = 0; i < orderDays.length; i++) {
      for (var j = 0; j < reservedDayPlans.length; j++) {
        if (reservedDayPlans[j].day === orderDays[i]) {
          fixedDaysAndTasksInOrder.push(reservedDayPlans[j].tasks);
        }
      }
    }

    res.status(200).json({ fixedDaysAndTasksInOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservedDayPlanByName = async (req, res) => {
  try {
    const reservedDayPlan = await ReservedDayPlans.findOne({
      name: req.params.name,
    });
    res.status(200).json({ reservedDayPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReservedDayPlan = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const tasks = req.body.tasks;
    const reservedDayPlan = await ReservedDayPlans.findOneAndUpdate(
      { day: name },
      { $set: { tasks: tasks } },
      { new: true }
    );
    res.status(200).json({ reservedDayPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearReservedDayPlanByName = async (req, res) => {
  try {
    const day = req.body.day.toLowerCase();
    const reservedDayPlan = await ReservedDayPlans.updateOne(
      { day: day },
      { $set: { tasks: [] } },
      { new: true }
    );
    res.status(200).json({ reservedDayPlan });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReservedDayPlan,
  getAllReservedDayPlans,
  getReservedDayPlanByName,
  updateReservedDayPlan,
  getFixedDaysAndTasksInOrder,
  clearReservedDayPlanByName,
};
