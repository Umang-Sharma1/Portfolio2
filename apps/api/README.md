# API Backend

Express + GraphQL backend with MongoDB and Redis.

## Features

- 🚀 Express server with Apollo Server 4
- 📊 GraphQL API with complete schema
- 🗄️ MongoDB with optimized indexes
- 💾 Redis caching
- 🔐 JWT authentication
- 🛡️ Security with Helmet.js
- 📦 Shared types and utilities
- 🧪 Jest for testing

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Seed database
npm run seed

# Type check
npm run type-check

# Lint
npm run lint
```

## Environment Variables

Create `.env`:

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/portfolio
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secret-key-here
ADMIN_TOKEN=your-admin-token-for-dev

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Project Structure

```
src/
├── server.ts         # Express + Apollo Server setup
├── config/           # Database and Redis config
├── graphql/          # GraphQL schema, resolvers, dataloaders
├── models/           # Mongoose models
├── middleware/       # Express middleware
├── scripts/          # Utility scripts (seed, etc.)
└── utils/            # Helper functions
```
