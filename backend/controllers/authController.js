const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map(e=>e.msg).join(', '), 400));
    }

    const { email, password, role, teacherId } = req.body;
    // if student, teacherId mandatory
    if (role === 'student' && !teacherId) throw new AppError('teacherId is required for role student', 400);

    // check existing
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already registered', 400);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role, teacherId: role === 'student' ? teacherId : undefined });

    const token = generateToken(user);
    res.status(201).json({ success: true, data: { id: user._id, email: user.email, role: user.role, token } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map(e=>e.msg).join(', '), 400));
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new AppError('Invalid credentials', 401);

    const token = generateToken(user);
    res.json({ success: true, data: { id: user._id, email: user.email, role: user.role, token } });
  } catch (err) { next(err); }
};
