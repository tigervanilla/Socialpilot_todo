const constants = require("../models/constants");
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
      res.status(200).send(result.ops[0]);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  getTasksPaginated: async (req, res, next) => {
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const tasksCollection = req.db.collection("tasks");
    const query = {
      $or: [
        { status: constants.TaskStatus.todo },
        { status: constants.TaskStatus.inprogress },
      ],
    };
    const taskCount = await tasksCollection.countDocuments(query);
    if (taskCount <= 20) {
      tasksCollection.find(query).toArray((err, tasks) => {
        if (err) {
          console.log(err);
          next(err);
          return;
        }
        res.json({ tasks, count: tasks.length });
        return;
      });
    } else {
      tasksCollection
        .find(query, { skip: 20 * (pageNumber - 1), limit: 20 })
        .toArray((err, tasks) => {
          if (err) {
            console.log(err);
            next(err);
            return;
          }
          res.json({ tasks, count: tasks.length });
          return;
        });
    }
  },
};