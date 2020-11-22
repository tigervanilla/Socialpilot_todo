const Task = require("../models/Task");

module.exports = {
  addTask: async (req, res, next) => {
    const body = req.body;
    const attachment = req.file;
    if (!body.title || !body.description || !body.targetDate || !body.status) {
      res.status(400).send("Bad Input");
    }
    const newTask = attachment ? new Task(body, attachment) : new Task(body);
    console.log("newTask::", newTask);
    try {
      const result = await req.db.collection("tasks").insertOne(newTask);
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
