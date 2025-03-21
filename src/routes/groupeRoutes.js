const express = require('express');
const groupeController = require('../controllers/groupeController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, groupeController.getAllGroupes);
router.post('/create', verifyToken, groupeController.createGroupe);
router.get('/:id', verifyToken, groupeController.getGroupById);
router.get('/user/groups', verifyToken, groupeController.getUserGroups);
router.post('/:id/join', verifyToken, groupeController.inviteToGroup); // new route to invite a user to a group
router.delete('/:id', verifyToken, groupeController.deleteGroup); // new route to delete a group
router.delete('/:id/members/:memberId', verifyToken, groupeController.removeMember); // new route to remove a member

module.exports = router;
