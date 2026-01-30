# Portfolio Monorepo 🚀

> Enterprise-level MERN stack portfolio with Turborepo - showcasing 40+ projects and 50+ technical skills

## 👨‍💻 About

**Umang Sharma**  
Software Engineer @ MAQ Software  
B.Tech Graduate - Class of 2025  
LeetCode Guardian (400+ problems, Top 1%, Rating 2265)

## 📦 Monorepo Structure

```
portfolio-monorepo/
├── apps/
│   ├── web/              # Next.js 14 frontend
│   └── api/              # Express + GraphQL backend
├── packages/
│   ├── ui/               # Shared UI components (Tailwind + styled-components)
│   ├── types/            # Shared TypeScript types
│   ├── config/           # Shared configurations (ESLint, TS, Tailwind)
│   └── utils/            # Shared utilities
├── docs/                 # All documentation files
├── docker/               # Docker configurations
├── turbo.json            # Turborepo pipeline config
└── package.json          # Root workspace config
```

## 🚀 Tech Stack

### Frontend (apps/web)

- **Framework:** Next.js 14 (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + styled-components
- **GraphQL Client:** Apollo Client
- **Animation:** Framer Motion
- **Testing:** Vitest, Playwright

### Backend (apps/api)

- **Runtime:** Node.js 18+
- **Framework:** Express
- **API:** GraphQL (Apollo Server 4)
- **Database:** MongoDB with 34+ optimized indexes
- **Cache:** Redis
- **Security:** Helmet.js, JWT, Rate Limiting
- **Testing:** Jest
- **Performance:** DataLoader (N+1 prevention)

### Shared Packages

- **@portfolio/ui** - Reusable React components
- **@portfolio/types** - Shared TypeScript definitions
- **@portfolio/config** - ESLint, TypeScript, Tailwind configs
- **@portfolio/utils** - Common utilities

### DevOps

- **Monorepo:** Turborepo (fast, cached builds)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), VPS (backend)

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 7+
- Redis 7+

### Installation

```bash
# Install all dependencies
npm install

# Start all apps in development mode
npm run dev

# Start specific app
npm run dev:web   # Frontend only
npm run dev:api   # Backend only

# Build everything
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Docker Setup

```bash
# Start all services (MongoDB, Redis, API, Web)
npm run docker:up

# Build and start
npm run docker:build

# Stop all services
npm run docker:down
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Start services with Docker:**

```bash
npm run docker:up
```

3. **Run development servers:**

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql
- MongoDB: localhost:27017
- Redis: localhost:6379

## 📝 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://admin:password123@localhost:27017/portfolio?authSource=admin
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
```

## 🎨 Color Scheme

- **Primary:** #6D28D9 (Deep Violet)
- **Secondary:** #10B981 (Emerald)
- **Accent:** #F59E0B (Amber)
- **Background:** #0F172A (Dark Mode Default)

## 📊 Features

- ✅ GraphQL API with Apollo Server
- ✅ Redis caching for performance
- ✅ MongoDB with optimized indexes
- ✅ Rate limiting & security hardening
- ✅ 95+ Lighthouse performance score
- ✅ CI/CD pipeline with automated testing
- ✅ Error tracking & monitoring
- ✅ Smart navigation (scroll on home, navigate on other pages)
- ✅ Advanced search & filter for skills/projects
- ✅ 40+ projects across 4 categories
- ✅ 50+ technical skills

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test --workspace=frontend

# Run backend tests
npm run test --workspace=backend

# E2E tests
npm run test:e2e --workspace=frontend
```

## 📦 Production Build

```bash
# Build all workspaces
npm run build

# Docker production build
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 License

MIT © Umang Sharma

## 🤝 Contact

- **Email:** umang.sharma@example.com
- **LinkedIn:** linkedin.com/in/umangsharma
- **GitHub:** github.com/umangsharma
- **LeetCode:** leetcode.com/umangsharma
