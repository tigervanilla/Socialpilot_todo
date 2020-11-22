const constants = require("./constants");

class Task {
  constructor(data, attachment) {
    if (data) {
      this.title = data.title || "";
      this.description = data.description || "";
      this.targetDate = new Date(data.targetDate) || Date.now();
      this.status =
        constants.TaskStatus[data.status] || constants.TaskStatus.todo;
      if (attachment) {
        this.attachment = {
          originalname: attachment.originalname,
          mimetype: attachment.mimetype,
          filename: attachment.filename,
          path: attachment.path,
          size: attachment.size,
        };
      }
    }
  }
}

module.exports = Task;
