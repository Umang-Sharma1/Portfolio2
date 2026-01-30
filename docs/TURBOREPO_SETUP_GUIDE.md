# Turborepo Monorepo Setup Guide

Complete guide for setting up and working with the portfolio monorepo.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Migration Steps](#migration-steps)
4. [Development Workflow](#development-workflow)
5. [Package Management](#package-management)
6. [Building & Deployment](#building--deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**
- **MongoDB** 7+ (for API)
- **Redis** 7+ (for caching)

### Verify Installation

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

## Initial Setup

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# This installs dependencies for:
# - Root workspace
# - apps/web
# - apps/api
# - All packages/*
```

### 2. Environment Variables

#### Root `.env` (optional)

```bash
# Create root .env for shared variables
touch .env
```

#### Frontend `.env.local`

```bash
# Create apps/web/.env.local
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
EOF
```

#### Backend `.env`

```bash
# Create apps/api/.env
cat > apps/api/.env << EOF
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/portfolio
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_TOKEN=dev-admin-token-for-testing

# CORS
CORS_ORIGIN=http://localhost:3000
EOF
```

### 3. Start Development

```bash
# Start all apps
npm run dev

# Or start individual apps
npm run dev:web  # Frontend only (port 3000)
npm run dev:api  # Backend only (port 5000)
```

---

## Migration Steps

### Moving from Old Structure to Monorepo

#### Step 1: Backup Current Code

```bash
# Create a backup
cp -r frontend frontend-backup
cp -r backend backend-backup
```

#### Step 2: Move Frontend Files

```bash
# Move frontend to apps/web/src
mkdir -p apps/web/src
mv frontend/src/* apps/web/src/

# Move config files
mv frontend/next.config.js apps/web/ 2>/dev/null || true
mv frontend/tailwind.config.ts apps/web/ 2>/dev/null || true
mv frontend/postcss.config.js apps/web/ 2>/dev/null || true
mv frontend/playwright.config.ts apps/web/ 2>/dev/null || true
mv frontend/vitest.config.ts apps/web/ 2>/dev/null || true
```

#### Step 3: Move Backend Files

```bash
# Move backend to apps/api/src
mkdir -p apps/api/src
mv backend/src/* apps/api/src/

# Move config files
mv backend/jest.config.js apps/api/ 2>/dev/null || true
mv backend/Dockerfile apps/api/ 2>/dev/null || true
```

#### Step 4: Update Imports

**Frontend imports (apps/web/src):**

```typescript
// Old imports
import { Project } from '../types';

// New imports with path aliases
import { Project } from '@portfolio/types';
import { formatDate } from '@portfolio/utils';
import { Button, Card } from '@portfolio/ui';
```

**Backend imports (apps/api/src):**

```typescript
// Old imports
import { Project } from './models/Project';

// New imports with path aliases
import { Project } from '@/models/Project';
import { ProjectType } from '@portfolio/types';
import { formatDate } from '@portfolio/utils';
```

#### Step 5: Clean Up Old Directories

```bash
# After verifying everything works
rm -rf frontend-backup
rm -rf backend-backup
rm -rf frontend
rm -rf backend
```

---

## Development Workflow

### Running Development Servers

```bash
# All apps in parallel
npm run dev

# Individual apps
turbo run dev --filter=web
turbo run dev --filter=api

# With dependencies (runs dependencies first)
turbo run dev --filter=web...
```

### Building

```bash
# Build everything
npm run build

# Build specific app
turbo run build --filter=web
turbo run build --filter=api

# Build with dependencies
turbo run build --filter=web...
```

### Testing

```bash
# Run all tests
npm run test

# Test specific package
turbo run test --filter=@portfolio/utils
turbo run test --filter=web
turbo run test --filter=api

# Watch mode
turbo run test --filter=api -- --watch
```

### Linting & Formatting

```bash
# Lint all code
npm run lint

# Lint specific package
turbo run lint --filter=web

# Format all code
npm run format

# Format specific files
prettier --write "apps/web/src/**/*.{ts,tsx}"
```

### Type Checking

```bash
# Type check everything
npm run type-check

# Type check specific package
turbo run type-check --filter=web
```

---

## Package Management

### Adding Dependencies

#### To Root

```bash
npm install -D turbo prettier --workspace-root
```

#### To Specific App

```bash
# Frontend
npm install axios --workspace=web

# Backend
npm install express --workspace=api
```

#### To Shared Package

```bash
# To @portfolio/ui
npm install framer-motion --workspace=@portfolio/ui

# To @portfolio/utils
npm install lodash --workspace=@portfolio/utils
```

### Installing New Shared Package

```bash
# In any app's package.json, add:
{
  "dependencies": {
    "@portfolio/ui": "*",
    "@portfolio/types": "*",
    "@portfolio/utils": "*"
  }
}

# Then run
npm install
```

### Removing Dependencies

```bash
# From specific workspace
npm uninstall package-name --workspace=web

# From root
npm uninstall package-name --workspace-root
```

---

## Building & Deployment

### Production Build

```bash
# Build all apps
npm run build

# Output:
# - apps/web/.next/
# - apps/api/dist/
```

### Environment Variables (Production)

#### Frontend (Vercel/Netlify)

```bash
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.yoursite.com/graphql
```

#### Backend (VPS/Cloud)

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb://username:password@host:27017/portfolio?authSource=admin
REDIS_URL=redis://username:password@host:6379
JWT_SECRET=very-secure-secret-key-min-32-characters
CORS_ORIGIN=https://yoursite.com
```

### Deployment Options

#### Option 1: Monorepo Deploy (Vercel)

```bash
# Root vercel.json
{
  "buildCommand": "turbo run build --filter=web",
  "outputDirectory": "apps/web/.next"
}
```

#### Option 2: Separate Deploys

**Frontend (Vercel):**

```bash
cd apps/web
vercel --prod
```

**Backend (Docker + VPS):**

```bash
cd apps/api
docker build -t portfolio-api .
docker push yourregistry/portfolio-api
```

#### Option 3: Docker Compose (Full Stack)

```bash
# Use docker/docker-compose.yml
cd docker
docker-compose up --build -d
```

---

## Troubleshooting

### Common Issues

#### 1. Module Not Found Errors

**Problem:**

```
Module not found: Can't resolve '@portfolio/ui'
```

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install

# Clear Turbo cache
rm -rf .turbo
```

#### 2. TypeScript Path Alias Not Working

**Problem:**

```
Cannot find module '@portfolio/types'
```

**Solution:**
Check `tsconfig.json` has correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@portfolio/ui": ["../../packages/ui/src"],
      "@portfolio/types": ["../../packages/types/src"],
      "@portfolio/utils": ["../../packages/utils/src"]
    }
  }
}
```

#### 3. Turbo Cache Issues

**Problem:**
Stale build outputs or cached errors.

**Solution:**

```bash
# Clear Turbo cache
turbo run clean
# or
rm -rf .turbo apps/*/.turbo packages/*/.turbo

# Force rebuild
turbo run build --force
```

#### 4. Port Already in Use

**Problem:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

#### 5. Workspace Dependency Version Mismatch

**Problem:**
Different versions of React in different packages.

**Solution:**

```bash
# Check versions
npm list react

# Update to same version everywhere
npm install react@18.2.0 --workspace=web
npm install react@18.2.0 --workspace=@portfolio/ui
```

### Performance Optimization

#### 1. Enable Remote Caching (Optional)

```bash
# turbo.json
{
  "remoteCache": {
    "signature": true
  }
}
```

#### 2. Optimize Build Output

```bash
# Only build what changed
turbo run build --filter=[HEAD^1]
```

#### 3. Parallel Execution

Turbo automatically runs tasks in parallel when possible. Monitor with:

```bash
turbo run build --graph
```

### Getting Help

- **Turbo Docs:** https://turbo.build/repo/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Apollo Server:** https://www.apollographql.com/docs/apollo-server/

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start all apps
npm run dev:web          # Frontend only
npm run dev:api          # Backend only

# Building
npm run build            # Build everything
npm run build --filter=web  # Build frontend

# Testing
npm run test             # Run all tests
npm run test --filter=api   # Test backend

# Quality
npm run lint             # Lint all code
npm run format           # Format all code
npm run type-check       # Type check

# Cleanup
npm run clean            # Clean all build outputs
turbo run clean --force  # Force clean with cache
```

### Workspace Structure

```
portfolio-monorepo/
├── apps/
│   ├── web/           → Next.js frontend (localhost:3000)
│   └── api/           → Express backend (localhost:5000)
├── packages/
│   ├── ui/            → Shared components
│   ├── types/         → Shared types
│   ├── config/        → Shared configs
│   └── utils/         → Shared utilities
├── docs/              → Documentation
├── docker/            → Docker configs
└── turbo.json         → Turbo pipeline config
```

---

## Next Steps

1. ✅ Complete monorepo setup
2. ✅ Move existing code to new structure
3. ✅ Update all import paths
4. ✅ Test all apps work correctly
5. ⏭️ Set up CI/CD pipeline
6. ⏭️ Configure remote caching
7. ⏭️ Deploy to production

---

**🎉 Your Turborepo monorepo is ready!**

For questions or issues, refer to the documentation in the `docs/` folder.
