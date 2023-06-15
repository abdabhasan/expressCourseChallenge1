import express, { response } from "express";
const app = express();

const PORT = 3000;
const tasks = [];

app.use(express.json());

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/tasks", (req, res) => {
  const { name, priority, id } = req.body;

  // Check if the task ID is unique
  const isUniqueId = tasks.every((task) => task.id !== id);

  if (!name || !priority || !id) {
    res
      .status(400)
      .json({ error: "Invalid payload. Name, priority, and ID are required." });
  } else if (!isUniqueId) {
    res.status(400).json({ error: "Task ID must be unique." });
  } else if (priority < 1 || priority > 5) {
    res
      .status(400)
      .json({ error: "Priority must be an integer between 1 and 5." });
  } else {
    const newTask = { name, priority, id };
    tasks.push(newTask);
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  }
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;

  // Find the task with the given ID
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    // Prevent updating the ID field
    if (updatedTask.hasOwnProperty("id")) {
      delete updatedTask.id;
    }

    // Update the task with the updated data
    tasks[taskIndex] = {
      id: taskId,
      ...updatedTask,
    };

    res.status(200).json({ message: "Task updated successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.listen(PORT, () =>
  console.log(`Running Express Server on http://localhost:${PORT}`)
);
