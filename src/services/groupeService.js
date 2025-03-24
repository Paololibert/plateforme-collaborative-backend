const prisma = require("../utils/prisma");
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailjet');

exports.getAllGroupes = async () => {
  try {
    return await prisma.groupe.findMany();
  } catch (error) {
    throw new Error("Error while fetching groups: " + error.message);
  }
};

exports.createGroupe = async (data) => {
  try {
    const { name, description, createdById, userIds } = data;

    const user = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingGroupe = await prisma.groupe.findFirst({
      where: {
        name: name,
        createdById: createdById,
      },
    });
    if (existingGroupe) {
      throw new Error("Groupe already exists");
    }

    // create a new group
    const groupe = await prisma.groupe.create({
      data: {
        name,
        description,
        createdById,
      },
    });

    // Send invitations to the specified users
    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        const invitedUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!invitedUser) {
          throw new Error(`User with ID ${userId} not found`);
        }

        // Create invitation record
        const invitation = await prisma.invitation.create({
          data: {
            email: invitedUser.email,
            groupeId: groupe.id,
            invitedById: createdById,
          },
        });

        // Send email invitation using Mailtrap
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const acceptUrl = `${process.env.SITE_URL}/api/invitations/accept/${invitation.id}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: invitedUser.email,
          subject: 'Group Invitation',
          html: `<p>You have been invited to join the group: ${groupe.name}</p>
                 <p><a href="${acceptUrl}">Click here to accept the invitation</a></p>`
        };

        await transporter.sendMail(mailOptions);
      }
    }

    return {
      id: groupe.id,
      name: groupe.name,
      description: groupe.description,
    };
  } catch (error) {
    throw new Error("Error while creating group: " + error.message);
  }
};

exports.getGroupById = async (id) => {
  try {
    const groupe = await prisma.groupe.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            firstname: true,
            email: true,
          },
        },
        GroupeMembers: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                firstname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!groupe) {
      throw new Error("Group not found");
    }

    return {
      id: groupe.id,
      name: groupe.name,
      description: groupe.description,
      createdBy: groupe.createdBy,
      members: groupe.GroupeMembers.map(member => member.users),
    };
  } catch (error) {
    throw new Error("Error while fetching group: " + error.message);
  }
};

exports.getUserGroups = async (userId) => {
  userId = parseInt(userId);
  try {
    const groupes = await prisma.groupe.findMany({
      where: {
        OR: [
          { createdById: userId },
          { GroupeMembers: { some: { userId: userId } } }
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            firstname: true,
            email: true,
          },
        },
        GroupeMembers: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                firstname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return groupes.map(groupe => ({
      id: groupe.id,
      name: groupe.name,
      description: groupe.description,
      createdBy: groupe.createdBy,
      members: groupe.GroupeMembers.map(member => member.users),
    }));
  } catch (error) {
    throw new Error("Error while fetching user groups: " + error.message);
  }
};

exports.inviteToGroup = async (groupId, userId, email) => {
  // 1. Vérifier si le groupe existe et appartient à l'utilisateur
  const group = await prisma.groupe.findFirst({
    where: {
      id: groupId,
      createdById: userId
    }
  });

  if (!group) {
    throw new Error("Group not found or you're not the owner");
  }

  // 2. Vérifier si une invitation existe déjà pour cet email dans ce groupe
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email: email,
      groupeId: groupId,
      status: {
        in: ['pending', 'accepted', 'validated']
      }
    }
  });

  if (existingInvitation) {
    // 3. Si invitation existe, vérifier si l'utilisateur est déjà membre
    const member = await prisma.groupeMembers.findFirst({
      where: {
        groupeId: groupId,
        users: {
          email: email
        }
      }
    });

    if (member) {
      throw new Error("This user is already a member of the group");
    }
  }

  // 4. Si pas d'invitation ou utilisateur non membre, créer l'invitation
  const invitation = await prisma.invitation.create({
    data: {
      email,
      groupeId: groupId,
      invitedById: userId,
    },
  });

  const acceptUrl = `${process.env.SITE_URL}/api/invitations/accept/${invitation.id}`;

  await sendMail({
    to: email,
    subject: 'Group Invitation',
    html: `
      <h3>Group Invitation</h3>
      <p>You have been invited to join the group: ${group.name}</p>
      <p><a href="${acceptUrl}">Click here to accept the invitation</a></p>
    `
  });
};

exports.deleteGroup = async (groupId, userId) => {
  const group = await prisma.groupe.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById !== userId) {
    throw new Error("Only the group creator can delete the group");
  }

  await prisma.groupe.delete({
    where: { id: groupId }
  });
};

exports.removeMember = async (groupId, userId, memberId) => {
  const group = await prisma.groupe.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById !== userId) {
    throw new Error("Only the group creator can remove members");
  }

  await prisma.groupeMembers.delete({
    where: {
      groupeId_userId: {
        groupeId: groupId,
        userId: memberId
      }
    }
  });
};


exports.validateInvitation = async (invitationId, userId) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { groupe: true }
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== "accepted") {
    throw new Error("Invitation not accepted");
  }

  if (invitation.groupe.createdById !== userId) {
    throw new Error("Only the group creator can validate invitations");
  }

  // Generate a random password
  const password = "azerty123";
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email: invitation.email }
  });

  if (!user) {
    // Create user if not exists
    user = await prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        name: invitation.email.split("@")[0],
        firstname: invitation.email.split("@")[0]
      }
    });

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const loginUrl = `http://localhost:3000/login`;

    await sendMail({
      to: invitation.email,
      subject: 'Welcome to the Platform',
      html: `
        <h3>Welcome to Platform Collaborative!</h3>
        <p>Your account has been created successfully!</p>
        <p>Here are your login credentials:</p>
        <p>Email: ${invitation.email}</p>
        <p>Password: ${password}</p>
        <p><a href="${loginUrl}">Click here to login</a></p>
        <p>Please change your password after your first login.</p>
      `
    });
  }

  // Add user to group
  await prisma.groupeMembers.create({
    data: {
      groupeId: invitation.groupeId,
      userId: user.id
    }
  });

  // Update invitation status to validated
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: "validated" }
  });

  return {
    status: "200",
    message: "Invitation validated",
    user: {
      id: user.id,
      name: user.name,
      firstname: user.firstname,
      email: user.email
    }
  };
};