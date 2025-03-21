const invitationService = require('../services/invitationService');
const groupeService = require('../services/groupeService');

exports.acceptInvitation = async (req, res) => {
  const invitationId = parseInt(req.params.id);

  try {
    const response = await invitationService.acceptInvitation(invitationId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.validateInvitation = async (req, res) => {
  const invitationId = parseInt(req.params.id);
  const userId = parseInt(req.user.userId);

  try {
    const user = await groupeService.validateInvitation(invitationId, userId);
    res.status(200).json({ message: 'Invitation validated successfully ', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSentInvitations = async (req, res) => {
  try { 
    const userId = parseInt(req.user.userId);
    const invitations = await invitationService.getSentInvitations(userId);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
