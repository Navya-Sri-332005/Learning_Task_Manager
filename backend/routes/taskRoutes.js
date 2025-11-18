const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', taskController.getTasks);

router.post('/', [
  body('userId').notEmpty().withMessage('userId required'),
  body('title').notEmpty().withMessage('title required')
], taskController.createTask);

router.put('/:id', [
  // title and progress optional
], taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
