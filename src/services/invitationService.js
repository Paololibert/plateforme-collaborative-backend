const prisma = require("../utils/prisma");
const bcrypt = require('bcryptjs');

exports.acceptInvitation = async (invitationId) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId }
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation already processed");
  }

  // Update invitation status to accepted
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: "accepted" }
  });

  return {
    status: "200",
    message: "Invitation accepted"
  };
};

exports.getSentInvitations = async (userId) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        invitedById: {
          equals: parseInt(userId)
        }
      },
      include: {
        groupe: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations.map(invitation => ({
      id: invitation.id.toString(),
      email: invitation.email,
      status: invitation.status,
      createdAt: invitation.createdAt.toISOString(),
      groupe: {
        id: invitation.groupe.id.toString(),
        name: invitation.groupe.name,
      },
    }));
  } catch (error) {
    throw new Error("Error while fetching sent invitations: " + error.message);
  }
};
