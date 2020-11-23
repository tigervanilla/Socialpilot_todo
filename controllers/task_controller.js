const { ObjectID } = require("mongodb");
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
    const { sortBy, sortDirection } = req.autosan.query;
    const tasksCollection = req.db.collection("tasks");
    const query = {
      $or: [
        { status: constants.TaskStatus.todo },
        { status: constants.TaskStatus.inprogress },
      ],
    };
    const taskCount = await tasksCollection.countDocuments(query);
    if (taskCount <= 20) {
      const filterOptn =
        sortBy === "targetDate"
          ? sortDirection === "desc"
            ? { sort: [["targetDate", -1]] }
            : { sort: [["targetDate", 1]] }
          : undefined;
      tasksCollection.find(query, filterOptn).toArray((err, tasks) => {
        if (err) {
          console.log(err);
          next(err);
          return;
        }
        res.json({ tasks, count: tasks.length });
        return;
      });
    } else {
      const filterOptn = { skip: 20 * (pageNumber - 1), limit: 20 };
      if (sortBy === "targetDate") {
        if (sortDirection === "desc") {
          filterOptn.sort = [["targetDate", -1]];
        } else {
          filterOptn.sort = [["targetDate", 1]];
        }
      }
      tasksCollection.find(query, filterOptn).toArray((err, tasks) => {
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

  changeStatus: async (req, res, next) => {
    if (!req.params._id || !req.params.newStatus) {
      res.status(400).send("Bad input id");
      return;
    }

    const newStatus = constants.TaskStatus[req.params.newStatus];
    if (!newStatus) {
      res.status(400).send("Bad input status");
      return;
    }

    try {
      const _id = ObjectID(req.params._id);
      const tasksCollection = req.db.collection("tasks");
      const result = await tasksCollection.findOneAndUpdate(
        { _id },
        { $set: { status: newStatus } },
        { returnOriginal: false }
      );
      res.status(200).json(result.value);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  deleteTask: async (req, res, next) => {
    if (!req.params._id) {
      res.status(400).send("Bad input");
      return;
    }
    try {
      const query = { _id: ObjectID(req.params._id) };
      const tasksCollection = req.db.collection("tasks");
      const result = await tasksCollection.findOneAndDelete(query);
      res.json(result.value);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  deleteMultipleTasks: async (req, res, next) => {
    if (!req.autosan.query || !req.autosan.query.id) {
      return res.status(400).send("Bad request");
    }
    try {
      const idListRaw =
        typeof req.autosan.query.id === "string"
          ? [req.autosan.query.id]
          : req.autosan.query.id;
      const idList = idListRaw.map((id) => ObjectID(id));
      const tasksCollection = req.db.collection("tasks");
      const result = tasksCollection.remove({ _id: { $in: idList } });
      res.send("Done");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateTaskDetails: async (req, res, next) => {
    if (!req.body.title && !req.body.description && !req.body.targetDate) {
      res.status(400).send("Bad input");
      return;
    }
    try {
      const _id = ObjectID(req.params._id);
      const newValue = {};
      if (req.body.title) {
        newValue.title = req.body.title;
      }
      if (req.body.description) {
        newValue.description = req.body.description;
      }
      if (req.body.targetDate && !isNaN(new Date(req.body.targetDate))) {
        newValue.targetDate = new Date(req.body.targetDate);
      }
      const tasksCollection = req.db.collection("tasks");
      const result = await tasksCollection.findOneAndUpdate(
        { _id },
        { $set: { ...newValue } },
        { returnOriginal: false }
      );
      res.status(200).json(result.value);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  searchTasks: (req, res, next) => {
    const searchTerm = req.autosan.query.term;
    const tasksCollection = req.db.collection("tasks");
    tasksCollection
      .find({ $text: { $search: searchTerm } }, { sort: [["targetDate", 1]] })
      .toArray((err, docs) => {
        res.send(docs);
      });
  },
};
