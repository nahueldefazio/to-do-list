// models/tasks.js
const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tasks', tasksSchema);
