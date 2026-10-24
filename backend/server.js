
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Task = require("./models/Task");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());


app.get("/api/tasks", async (req, res) => {
 try {
   const tasks = await Task.find().sort({ createdAt: -1 });
   res.json(tasks);
 } catch (error) {  
   res.status(500).json({ message: "Failed to fetch tasks." });
 }
});

app.post("/api/tasks", async (req, res) => {
 try {
   const { title, description, status } = req.body || {};

   if (!title || !String(title).trim()) {
     return res.status(400).json({ message: "Task title is required." });
   }

   const task = new Task({
     title: String(title).trim(),
     description: description || "",
     status: status || "pending",
   });

   const savedTask = await task.save();
   res.status(201).json(savedTask);
 } catch (error) {
   if (error.name === "ValidationError") {
     return res.status(400).json({ message: error.message });
   }

   res.status(500).json({ message: "Server error while creating this task." });
 }
});

app.put("/api/tasks/:id", async (req, res) => {
 try {
   const { id } = req.params;
   const { title, description, status } = req.body || {};

   if (!isValidObjectId(id)) {
     return res.status(400).json({ message: "Invalid task ID." });
   }

   if (title !== undefined && !String(title).trim()) {
     return res.status(400).json({ message: "Task title is required." });
   }

   const updateData = {};

   if (title !== undefined) updateData.title = String(title).trim();
   if (description !== undefined) updateData.description = description;
   if (status !== undefined) updateData.status = status;

   const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
     new: true,
     runValidators: true,
   });

   if (!updatedTask) {
     return res.status(404).json({ message: "Task not found." });
   }

   res.json({ message: "Task updated successfully", task: updatedTask });
 } catch (error) {
   if (error.name === "ValidationError") {
     return res.status(400).json({ message: error.message });
   }

   res.status(500).json({ message: "Server error while updating this task." });
 }
});

app.delete("/api/tasks/:id", async (req, res) => {
 try {
   const { id } = req.params;

   if (!isValidObjectId(id)) {
     return res.status(400).json({ message: "Invalid task ID." });
   }

   const deletedTask = await Task.findByIdAndDelete(id);

   if (!deletedTask) {
     return res.status(404).json({ message: "Task not found." });
   }

   res.json({ message: "Task deleted successfully", task: deletedTask });
 } catch (error) {
   res.status(500).json({ message: "Server error while deleting task." });
 }
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

mongoose.connect(process.env.MONGO_URI)
 .then(() => {
   console.log("MongoDB Connected!");
 })
 .catch((error) => {
  console.log(process.env.MONGO_URI); 
  console.log(error); 
   console.error("MongoDB connection failed:", error.message);
 });

app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});
