import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    inputText: {
      type: String,
    },

    operation: {
      type: String,
    },

    result: {
      type: String,
    },

    status: {
      type: String,
      default: "pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;