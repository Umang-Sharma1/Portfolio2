# Enterprise Portfolio - Setup Instructions

## 🚀 Quick Start

### Step 1: Install Dependencies

```powershell
# Install root dependencies
npm install

# This will also install dependencies for frontend and backend workspaces
```

### Step 2: Set Up Environment Variables

#### Backend (.env)

Create `backend/.env` file:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://admin:password123@localhost:27017/portfolio?authSource=admin
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

#### Frontend (.env.local)

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start Docker Services

```powershell
# Start MongoDB and Redis with Docker Compose
npm run docker:up

# This will start:
# - MongoDB on port 27017
# - Redis on port 6379
# - Backend on port 4000 (optional, or run separately)
```

### Step 4: Seed the Database

```powershell
# Seed database with 50+ skills and 40+ projects
cd backend
npm run seed
cd ..
```

### Step 5: Start Development Servers

```powershell
# Option 1: Run both frontend and backend together
npm run dev

# Option 2: Run separately in different terminals
npm run dev:frontend  # Next.js on http://localhost:3000
npm run dev:backend   # Express + GraphQL on http://localhost:4000
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend GraphQL:** http://localhost:4000/graphql
- **Backend Health:** http://localhost:4000/health

## 🛠️ Development Commands

### Root Commands

```powershell
npm run dev              # Run frontend and backend
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only
npm run build            # Build both workspaces
npm run test             # Run all tests
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

### Backend Commands

```powershell
cd backend
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm run start            # Start production server
npm run test             # Run Jest tests
npm run seed             # Seed database
npm run lint             # Run ESLint
```

### Frontend Commands

```powershell
cd frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run Next.js linter
npm run test             # Run Vitest tests
npm run test:e2e         # Run Playwright E2E tests
npm run test:coverage    # Run tests with coverage
```

## 🐳 Docker Commands

```powershell
# Start all services (MongoDB, Redis, Backend)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Remove volumes (warning: deletes data)
docker-compose down -v
```

## 📊 Database Management

### MongoDB Access

```powershell
# Connect to MongoDB using Docker
docker exec -it portfolio-mongodb mongosh -u admin -p password123

# Or use MongoDB Compass with connection string:
mongodb://admin:password123@localhost:27017/portfolio?authSource=admin
```

### Redis Access

```powershell
# Connect to Redis CLI
docker exec -it portfolio-redis redis-cli

# Clear Redis cache
docker exec -it portfolio-redis redis-cli FLUSHALL
```

## 🧪 Testing

### Backend Tests

```powershell
cd backend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
```

### Frontend Tests

```powershell
cd frontend
npm test                 # Run Vitest unit tests
npm run test:coverage    # Run with coverage report
npm run test:e2e         # Run Playwright E2E tests
```

## 🚢 Production Deployment

### Frontend (Vercel)

```powershell
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Backend (Docker)

```powershell
# Build production image
docker build -t portfolio-backend ./backend

# Run production container
docker run -d \
  -p 4000:4000 \
  --env-file backend/.env \
  --name portfolio-backend \
  portfolio-backend
```

## 🔧 Troubleshooting

### Port Already in Use

```powershell
# Find process using port 3000 or 4000
netstat -ano | findstr :3000
netstat -ano | findstr :4000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Docker Issues

```powershell
# Reset Docker containers
docker-compose down -v
docker-compose up -d --build

# Clear Docker system
docker system prune -a
```

### MongoDB Connection Issues

```powershell
# Check if MongoDB is running
docker ps | findstr mongodb

# Restart MongoDB
docker restart portfolio-mongodb

# Check logs
docker logs portfolio-mongodb
```

### Redis Connection Issues

```powershell
# Check if Redis is running
docker ps | findstr redis

# Restart Redis
docker restart portfolio-redis

# Test connection
docker exec -it portfolio-redis redis-cli PING
```

## 📝 Common Tasks

### Update Skills/Projects Data

```powershell
# Edit seed file
# backend/src/scripts/seed.ts

# Re-run seed
cd backend
npm run seed
```

### Add New GraphQL Query

1. Update schema in `backend/src/graphql/schema.ts`
2. Add resolver in `backend/src/graphql/resolvers/`
3. Update types in `frontend/src/types/index.ts`
4. Add query in `frontend/src/lib/graphql/queries.ts`

### Create New Page

```powershell
# Create page file
# frontend/src/app/[pagename]/page.tsx

# Pages are automatically routed by Next.js
```

## 🎨 Customization

### Change Color Scheme

Edit `frontend/tailwind.config.ts`:

```typescript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR',
}
```

### Modify Personal Information

- Update hero section: `frontend/src/components/home/Hero.tsx`
- Update footer: `frontend/src/components/layout/Footer.tsx`
- Update metadata: `frontend/src/app/layout.tsx`

## 📚 Tech Stack Documentation

- **Next.js:** https://nextjs.org/docs
- **Apollo GraphQL:** https://www.apollographql.com/docs/
- **MongoDB:** https://docs.mongodb.com/
- **Redis:** https://redis.io/documentation
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Docker:** https://docs.docker.com/

## 🤝 Need Help?

Check the following files for examples:

- GraphQL Schema: `backend/src/graphql/schema.ts`
- MongoDB Models: `backend/src/models/`
- React Components: `frontend/src/components/`
- GraphQL Queries: `frontend/src/lib/graphql/queries.ts`

Happy coding! 🚀
