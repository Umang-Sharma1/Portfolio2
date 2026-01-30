# Next.js Frontend App

Modern Next.js 14 frontend with Tailwind CSS and styled-components.

## Features

- ⚡ Next.js 14 with App Router and Server Components
- 🎨 Tailwind CSS + styled-components for styling
- 📡 Apollo Client for GraphQL queries
- 🔤 TypeScript for type safety
- 🧪 Vitest for unit tests
- 🎭 Playwright for E2E tests
- 📦 Shared packages (@portfolio/ui, @portfolio/types, @portfolio/utils)

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

# Run E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities and configs
├── styles/           # Global styles
└── tests/            # Tests
```
