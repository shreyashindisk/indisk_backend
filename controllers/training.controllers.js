const Training = require("../models/training.models");

const createTraining = async (req, res) => {
  try {
    var { name, document_url, kitchen, video_url, comments } = req.body;
    name = name.trim().toLowerCase();
    document_url = document_url.trim();
    video_url = video_url.trim();
    comments = comments.trim().toLowerCase();
    kitchen = kitchen.trim().toLowerCase();

    if (kitchen.includes("central")) {
      kitchen = "central";
    } else if (kitchen.includes("sales")) {
      kitchen = "sales";
    } else if (kitchen.includes("both")) {
      kitchen = "both";
    }
    const training = await Training.create({
      name,
      document_url,
      kitchen,
      video_url,
      comments,
    });
    res.status(201).json({ training });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTrainings = async (req, res) => {
  try {
    var { kitchen } = req.query;
    if (kitchen) {
      kitchen = kitchen.trim().toLowerCase();
      if (kitchen.includes("central")) {
        kitchen = "central";
      } else if (kitchen.includes("sales")) {
        kitchen = "sales";
      } else if (kitchen.includes("both")) {
        kitchen = "both";
      }
    }
    var trainings;
    if ("userType" in req.query) {
      if (kitchen === "central") {
        trainings = await Training.find({
          kitchen: "central",
        });
      } else if (kitchen === "sales") {
        trainings = await Training.find({
          kitchen: "sales",
        });
      } else {
        trainings = await Training.find({ kitchen: "both" });
      }
      return res.status(200).json({ trainings });
    }
    if (kitchen === "central") {
      //kitchen is central or both
      trainings = await Training.find({
        kitchen: { $in: ["central", "both"] },
      });
    } else if (kitchen === "sales") {
      //kitchen is sales or both
      trainings = await Training.find({ kitchen: { $in: ["sales", "both"] } });
    }

    res.status(200).json({ trainings });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteByName = async (req, res) => {
  try {
    var { name } = req.query;
    name = name.trim().toLowerCase();

    const data = await Training.findOneAndDelete({ name: name });
    res.status(200).json({ data });
  } catch (error) {
    console.log("error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTraining, getAllTrainings, deleteByName };
