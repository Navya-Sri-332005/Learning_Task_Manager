const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({ windowMs: 60*1000, max: 10, message: { success: false, message: 'Too many login attempts, try again later' } });

router.post('/signup', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher')
], authController.signup);

router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password required')
], authController.login);

module.exports = router;
