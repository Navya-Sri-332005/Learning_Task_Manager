const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who owns this task
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  progress: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
