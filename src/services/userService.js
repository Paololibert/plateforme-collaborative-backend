const prisma = require("../utils/prisma");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        firstname: true,
        email: true,
      },
    });
    return users;
  } catch (error) {
    throw new Error("Error while fetching users: " + error.message);
  }
};

exports.register = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;
    return await prisma.user.create({ data });
  } catch (error) {
    if (error.message.includes("User already exists")) {
      throw new Error("Cet email est déjà utilisé.");
    }
    throw new Error("Erreur lors de la création de l'utilisateur: " + error.message);
  }
};
