const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const groupeRoutes = require('./routes/groupeRoutes');
const authRoutes = require('./routes/authRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import dashboard routes

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://plateforme-collaborative-newfront.vercel.app'
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupeRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;