# 🚀 Turborepo Monorepo - Quick Reference

## ⚡ Essential Commands

```bash
# Development
npm run dev                      # Start all apps
npm run dev:web                  # Frontend only (port 3000)
npm run dev:api                  # Backend only (port 5000)

# Building
npm run build                    # Build everything
npm run build --filter=web       # Build frontend
npm run build --filter=api       # Build backend

# Testing
npm run test                     # All tests
npm run test --filter=api        # Backend tests

# Quality
npm run lint                     # Lint all
npm run format                   # Format all
npm run type-check               # Type check all

# Docker
npm run docker:up                # Start services
npm run docker:down              # Stop services
npm run docker:build             # Rebuild & start

# Cleanup
npm run clean                    # Clean outputs
turbo run clean --force          # Force clean
```

## 📦 Workspace Packages

```typescript
// Import from shared packages
import { Button, Card, Badge, Spinner, Input } from '@portfolio/ui';
import { Project, Skill, User, ProjectCategory } from '@portfolio/types';
import { formatDate, formatNumber, truncate, debounce } from '@portfolio/utils';
```

## 🎯 Turbo Filters

```bash
# Run for specific workspace
turbo run dev --filter=web
turbo run build --filter=api

# Run with dependencies
turbo run build --filter=web...

# Run for multiple workspaces
turbo run test --filter=web --filter=api

# Force run (ignore cache)
turbo run build --force

# Show dependency graph
turbo run build --graph
```

## 📁 Path Aliases

### Frontend (apps/web)

```typescript
import Component from '@/components/Component';
import { Button } from '@portfolio/ui';
import { Project } from '@portfolio/types';
import { formatDate } from '@portfolio/utils';
```

### Backend (apps/api)

```typescript
import Project from '@/models/Project';
import { ProjectType } from '@portfolio/types';
import { formatDate } from '@portfolio/utils';
```

## 🐳 Docker Quick Start

```bash
# Start everything
cd docker && docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild
docker-compose up --build -d

# Access MongoDB
docker exec -it portfolio-mongodb mongosh

# Access Redis
docker exec -it portfolio-redis redis-cli
```

## 🎨 Component Examples

### Button

```tsx
import { Button } from '@portfolio/ui';

<Button variant="primary" size="lg" fullWidth>
  Submit
</Button>;
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@portfolio/ui';

<Card hover padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>;
```

### Badge

```tsx
import { Badge } from '@portfolio/ui';

<Badge variant="success" size="sm">
  Active
</Badge>;
```

## 🔧 Environment Files

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/portfolio
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## 🐛 Troubleshooting

### Clear Cache & Reinstall

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo
npm install
```

### Kill Port Process

```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Force Rebuild

```bash
turbo run build --force
```

## 📊 Project Structure

```
portfolio-monorepo/
├── apps/
│   ├── web/          → Next.js (port 3000)
│   └── api/          → Express (port 5000)
├── packages/
│   ├── ui/           → Components
│   ├── types/        → TypeScript types
│   ├── utils/        → Utilities
│   └── config/       → Configs
├── docs/             → Documentation
├── docker/           → Docker files
└── turbo.json        → Turbo config
```

## 🔗 URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **GraphQL:** http://localhost:5000/graphql
- **MongoDB:** mongodb://localhost:27017
- **Redis:** redis://localhost:6379

## 📚 Documentation

- `MONOREPO_COMPLETE.md` - Complete implementation guide
- `TURBOREPO_SETUP_GUIDE.md` - Setup & migration guide
- `README.md` - Project overview
- `docs/` - All documentation
- `packages/*/README.md` - Package-specific docs

## 🎯 Migration Steps

1. Run: `.\migrate-to-monorepo.ps1`
2. Install: `npm install`
3. Start: `npm run dev`
4. Open: http://localhost:3000

---

**💡 Tip:** Keep this file handy for quick reference while developing!
