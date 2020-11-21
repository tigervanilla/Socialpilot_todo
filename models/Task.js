const constants = require('./constants');

class Task {
  constructor(data) {
    if (data) {
      this.title = data.title || '';
      this.description = data.description || '';
      this.targetDate = new Date(data.targetDate) || Date.now();
      this.status = constants.TaskStatus[data.status];
      this.media = data.media;
    }
  }
}

module.exports = Task;