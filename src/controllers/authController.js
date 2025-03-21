const authService = require('../services/authService');
const LoginSchema = require('../schemas/login.schema');

exports.login = async (req, res) => {
  const { error } = LoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const authenticate = await authService.login(req.body);
    res.cookie('token', authenticate.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });
    res.status(200).json({
      //token: authenticate.token,
      id: authenticate.user.id,
      email: authenticate.user.email,
      name: authenticate.user.name,
      firstname: authenticate.user.firstname
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.show = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};