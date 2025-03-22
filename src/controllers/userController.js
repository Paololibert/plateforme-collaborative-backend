const userSchema = require('../schemas/user.schema');
const userService = require('../services/userService');
const userUpdateSchema = require('../schemas/userUpdate.schema');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = parseInt(req.user.userId);
    const userData = {
      name: req.body.name,
      firstname: req.body.firstname,
      email: req.body.email,
    };

    const updatedUser = await userService.updateUser(userId, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
