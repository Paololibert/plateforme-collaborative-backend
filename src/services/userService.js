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
      throw new Error("This email is already in use.");
    }
    throw new Error("Error while creating user: " + error.message);
  }
};

exports.updateUser = async (userId, data) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);

    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name: data.name || user.name,
        firstname: data.firstname || user.firstname,
        email: data.email || user.email,
        password: data.password || user.password,
      },
      select: {
        id: true,
        name: true,
        firstname: true,
        email: true,
      }
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};
