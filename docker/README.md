# Docker Setup for Portfolio

This directory contains Docker configuration files for local development.

## Quick Start

### Start all services (MongoDB, Redis, API, Web):

```bash
docker-compose up -d
```

### Start only database services:

```bash
docker-compose up -d mongodb redis
```

### Start with Nginx reverse proxy (production-like):

```bash
docker-compose --profile production up -d
```

## Services

| Service | Port  | Description              |
| ------- | ----- | ------------------------ |
| MongoDB | 27017 | Database                 |
| Redis   | 6380  | Cache                    |
| API     | 4000  | GraphQL API              |
| Web     | 3000  | Next.js Frontend         |
| Nginx   | 80    | Reverse Proxy (optional) |

## Files

- `docker-compose.yml` - Main orchestration file (in root)
- `Dockerfile.api` - API service build configuration
- `Dockerfile.web` - Web service build configuration
- `nginx.conf` - Nginx reverse proxy configuration
- `mongo-init.js` - MongoDB initialization script

## Environment Variables

The services use these default environment variables:

### API

- `MONGODB_URI`: `mongodb://admin:password123@mongodb:27017/portfolio?authSource=admin`
- `REDIS_URL`: `redis://redis:6379`
- `PORT`: `4000`

### Web

- `NEXT_PUBLIC_GRAPHQL_URL`: `http://localhost:4000/graphql`

## Useful Commands

```bash
# View logs
docker-compose logs -f api
docker-compose logs -f web

# Rebuild after changes
docker-compose up -d --build

# Stop all services
docker-compose down

# Remove volumes (reset data)
docker-compose down -v

# Access MongoDB shell
docker exec -it portfolio-mongodb mongosh -u admin -p password123

# Access Redis CLI
docker exec -it portfolio-redis redis-cli
```

## Health Checks

All services have health checks configured:

- MongoDB: `mongosh --eval "db.adminCommand('ping')"`
- Redis: `redis-cli ping`
- API: `curl http://localhost:4000/health`

## Development Notes

- Volume mounts enable hot reload for both API and Web
- `WATCHPACK_POLLING=true` enables file watching in Docker for Next.js
- The Nginx service is optional and only starts with `--profile production`
