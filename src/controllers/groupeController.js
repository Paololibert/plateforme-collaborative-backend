const Joi = require('joi');
const groupeSchema = require('../schemas/groupe.schema');
const groupeService = require('../services/groupeService');

exports.getAllGroupes = async (req, res) => {
  try {
    const groupes = await groupeService.getAllGroupes();
    res.json(groupes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGroupe = async (req, res) => {
  const { error } = groupeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const data = {
      ...req.body,
      createdById: req.user.userId // Extracted from token
    };

    const groupe = await groupeService.createGroupe(data);
    res.status(201).json(groupe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  const idSchema = Joi.object({
    id: Joi.number().integer().required()
  });

  const id = parseInt(req.params.id); // convert to integer
  const { error } = idSchema.validate({ id });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const groupe = await groupeService.getGroupById(id);
    res.json(groupe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = parseInt(req.user.userId); // extract from token

  try {
    const groupes = await groupeService.getUserGroups(userId);
    res.json(groupes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.inviteToGroup = async (req, res) => {
  const { email } = req.body;
  const groupId = parseInt(req.params.id);
  const userId = parseInt(req.user.userId);

  try {
    await groupeService.inviteToGroup(groupId, userId, email);
    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const groupId = parseInt(req.params.id);
  const userId = parseInt(req.user.userId);

  try {
    await groupeService.deleteGroup(groupId, userId);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  const groupId = parseInt(req.params.id);
  const memberId = parseInt(req.params.memberId);
  const userId = parseInt(req.user.userId);

  try {
    await groupeService.removeMember(groupId, userId, memberId);
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
