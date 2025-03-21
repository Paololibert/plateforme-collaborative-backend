const express = require('express');
const invitationController = require('../controllers/invitationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/accept/:id', invitationController.acceptInvitation);
router.post('/validate/:id', verifyToken, invitationController.validateInvitation); // Add verifyToken middleware
router.get('/sent', verifyToken, invitationController.getSentInvitations);

module.exports = router;
