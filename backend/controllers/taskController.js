const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

// Helper to check ObjectId
const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

// GET /tasks
// - student: own tasks
// - teacher: tasks created by teacher OR tasks belonging to their assigned students
// Supports optional query params: progress, due=week|overdue
exports.getTasks = async (req, res, next) => {
  try {
    const user = req.user; // from protect
    const { progress, due } = req.query; // optional filters

    let query = {};

    if (user.role === 'student') {
      // --- START MODIFIED STUDENT QUERY ---
      // Student must see tasks created by themselves OR created by their assigned teacher.
      // The user object (req.user) is populated in authMiddleware and includes teacherId.
      query = { $or: [ { userId: user._id }, { userId: user.teacherId } ] };
      // --- END MODIFIED STUDENT QUERY ---
    } else if (user.role === 'teacher') {
      // tasks created by teacher OR tasks where the student has teacherId === this teacher

      // find student ids assigned to this teacher
      const students = await User.find({ teacherId: user._id }).select('_id');
      const studentIds = students.map(s => s._id);

      query = { $or: [ { userId: user._id }, { userId: { $in: studentIds } } ] };
    }

    if (progress) query.progress = progress;

    // due filter: 'week' or 'overdue'
    if (due === 'week') {
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);
      query.dueDate = { $gte: now, $lte: weekLater };
    } else if (due === 'overdue') {
      const now = new Date();
      query.dueDate = { $lt: now };
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

// POST /tasks
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new AppError(errors.array().map(e=>e.msg).join(', '), 400));

    const user = req.user;
    const { userId, title, description, dueDate, progress } = req.body;

    // userId must match logged-in user
    if (!isValidObjectId(userId) || userId.toString() !== user._id.toString()) {
      return next(new AppError('userId must match the authenticated user', 403));
    }

    const task = await Task.create({ userId, title, description, dueDate: dueDate || undefined, progress: progress || undefined });
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

// PUT /tasks/:id

// ... (exports.getTasks, exports.createTask remain the same)

// PUT /tasks/:id
exports.updateTask
= async (req, res, next) => {
  try {
    // ... (task fetching and authorization logic remains the same)

    // --- START MODIFIED FIELD RESTRICTION ---
    // Only allow changes to the 'progress' field
    const allowed = ['progress'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined)
task[field] = req.body[field];
    });
    // --- END MODIFIED FIELD RESTRICTION ---
 
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};
// ... (exports.deleteTask remains the fixed version using task.deleteOne())

// DELETE /tasks/:id
exports.deleteTask
= async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new
AppError('Invalid task id', 400));
 
    const task = await Task.findById(id);
    if (!task) return next(new AppError('Task not found', 404));

    // --- Authorization Logic (Keep the updated logic from the previous step) ---
    const isOwner = task.userId.toString() === req.user._id.toString();
    let isTeacherAuthorized = false;

    if (req.user.role === 'teacher' && !isOwner) {
      const student = await User.findById(task.userId).select('teacherId');
      if (student && student.teacherId && student.teacherId.toString() === req.user._id.toString()) {
        isTeacherAuthorized = true;
      }
    }

    if (!isOwner && !isTeacherAuthorized) {
      return next(new AppError('Not authorized to delete this task', 403));
    }
    // --------------------------------------------------------------------------
 
    await task.deleteOne(); // <-- FIXED: Use deleteOne() instead of the deprecated remove()
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
};