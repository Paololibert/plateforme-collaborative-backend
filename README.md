# Backend - Collaborative Platform

## Prerequisites

- Node.js (version 16 or higher)
- MySQL (version 8.0 or higher)
- npm or yarn

## Installation

1. Clone the project and install dependencies:

```bash
cd backend
npm install
```

2. Install Prisma globally:

```bash
npm install -g prisma
```

3. Configure environment variables:
   Create a `.env` file in the backend root directory with:

```env
DATABASE_URL="mysql://user:password@localhost:3306/your_database"
EMAIL_HOST="smtp.mailtrap.io"
EMAIL_PORT=2525
EMAIL_USER="your_mailtrap_user"
EMAIL_PASS="your_mailtrap_password"
JWT_SECRET="your_jwt_secret"
SITE_URL="http://localhost:3000"
```

4. Initialize the database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Getting Started

To start the server in development mode:

```bash
npm run dev
```

The server starts by default on: `http://localhost:5000`

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── src/
│   ├── controllers/     # Application controllers
│   ├── middlewares/     # Middlewares (auth, etc.)
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utilities
├── .env                # Environment variables
└── app.js             # Application entry point
```

## Main Features

- JWT Authentication
- Group management
- Invitation system
- Email sending (via Mailtrap)
- RESTful API

## Available Scripts

```bash
# Start in development
npm run dev

# Start in production
npm start

# Update Prisma schema
npm run prisma:generate

# Apply migrations
npm run prisma:migrate

# Reset the database
npm run prisma:reset
```

## Main Dependencies

- express: Web framework
- prisma: ORM for the database
- jsonwebtoken: JWT token management
- bcryptjs: Password hashing
- nodemailer: Email sending
- cors: CORS management
- cookie-parser: Cookie parsing

## Development Environment Setup

1. **Database**:

   - Install MySQL
   - Create a database
   - Configure the URL in `.env`

2. **Mailtrap**:

   - Create an account on Mailtrap
   - Configure the credentials in `.env`

3. **Recommended VSCode Extensions**:
   - Prisma (for syntax highlighting)
   - REST Client (to test the API)
   - DotENV (for .env files)

## Development Notes

- Protected routes use the `verifyToken` middleware
- Passwords are hashed with bcrypt
- Invitations are managed via email
- JWT tokens are stored in cookies
