const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the dashboard!' });
});

module.exports = router;
