import express from "express";
import Task from "../models/task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, inputText, operation } = req.body;

    let processedResult = "";

    if (operation === "uppercase") {
      processedResult = inputText.toUpperCase();
    } else if (operation === "lowercase") {
      processedResult = inputText.toLowerCase();
    } else if (operation === "reverse") {
      processedResult = inputText.split("").reverse().join("");
    } else if (operation === "word_count") {
      processedResult = inputText.trim().split(/\s+/).length.toString();
    } else {
      return res.status(400).json({
        message: "Invalid operation",
      });
    }

    const task = await Task.create({
      title,
      inputText,
      operation,
      result: processedResult,
      status: "completed",
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET TASKS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;