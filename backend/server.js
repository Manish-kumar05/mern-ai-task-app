import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import Task from "./models/task.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);

// CREATE TASK
app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, inputText, operation } = req.body;

    let result = "";

    if (operation === "uppercase") {
      result = inputText.toUpperCase();
    } else if (operation === "lowercase") {
      result = inputText.toLowerCase();
    } else if (operation === "reverse") {
      result = inputText.split("").reverse().join("");
    } else if (operation === "word_count") {
      result = inputText.trim().split(/\s+/).length.toString();
    } else {
      return res.status(400).json({ message: "Invalid operation" });
    }

    const task = await Task.create({
      title,
      inputText,
      operation,
      result,
      status: "completed",
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TASK HISTORY
app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});