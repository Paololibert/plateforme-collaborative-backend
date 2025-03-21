const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, userController.getAllUsers);
router.post('/register', userController.register);

module.exports = router;
