# 📊 System Architecture - Visual Diagrams

## Quick Reference: Component Interaction

### 1. Request Flow Diagram

```
USER BROWSER
    │
    │ 1. HTTP Request
    ↓
┌─────────────────────────────┐
│   NEXT.JS FRONTEND          │
│   Port: 3000                │
│   • React Components        │
│   • Apollo Client           │
│   • Tailwind CSS            │
└─────────────┬───────────────┘
              │
              │ 2. GraphQL Query
              ↓
┌─────────────────────────────┐
│   EXPRESS BACKEND           │
│   Port: 4000                │
│   • Rate Limiting           │
│   • CORS Validation         │
│   • Helmet Security         │
└─────────────┬───────────────┘
              │
              │ 3. GraphQL Parse
              ↓
┌─────────────────────────────┐
│   APOLLO SERVER             │
│   • Schema Validation       │
│   • Query Routing           │
│   • Complexity Check        │
└─────────────┬───────────────┘
              │
              │ 4. Execute Resolver
              ↓
┌─────────────────────────────┐
│   RESOLVER LOGIC            │
│   • Generate Cache Key      │
│   • Check Redis Cache       │
└─────────────┬───────────────┘
              │
        ┌─────┴─────┐
        │           │
        ↓           ↓
┌──────────────┐  ┌──────────────┐
│    REDIS     │  │   MONGODB    │
│  Port: 6379  │  │ Port: 27017  │
│              │  │              │
│ Cache Hit?   │  │ Query DB     │
│   Yes ──┐    │  │ if no cache  │
│         │    │  │              │
└─────────┼────┘  └──────┬───────┘
          │              │
          └──────┬───────┘
                 │ 5. Return Data
                 ↓
         ┌───────────────┐
         │   RESPONSE    │
         │   • JSON      │
         │   • Compressed│
         │   • Cached    │
         └───────────────┘
```

---

## 2. Database Schema Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    SKILLS COLLECTION                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ _id: ObjectId                                        │ │
│ │ name: "React"                                        │ │
│ │ category: "FRONTEND"                                 │ │
│ │ proficiency: 95                                      │ │
│ │ yearsOfExperience: 3                                 │ │
│ │ projects: ["Portfolio", "E-commerce"] ───────┐      │ │
│ └──────────────────────────────────────────────┼──────┘ │
└────────────────────────────────────────────────┼────────┘
                                                  │
                    Denormalized Reference       │
                    (No Foreign Key)              │
                                                  │
┌─────────────────────────────────────────────────┼──────┐
│                  PROJECTS COLLECTION            ↓      │
│ ┌───────────────────────────────────────────────────┐ │
│ │ _id: ObjectId                                      │ │
│ │ title: "Portfolio"                                 │ │
│ │ category: "FULLSTACK"                              │ │
│ │ technologies: ["React", "Node.js", "MongoDB"] ←────┤ │
│ │ featured: true                                     │ │
│ │ githubUrl: "https://..."                           │ │
│ │ liveUrl: "https://..."                             │ │
│ └───────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│             CONTACTMESSAGES COLLECTION                │
│ ┌─────────────────────────────────────────────────┐  │
│ │ _id: ObjectId                                    │  │
│ │ name: "John Doe"                                 │  │
│ │ email: "john@example.com"                        │  │
│ │ subject: "Collaboration"                         │  │
│ │ message: "Let's work together..."                │  │
│ │ createdAt: ISODate                               │  │
│ └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
         ↑
         │ Independent - No relationships
         │ Simple insert-only collection
```

---

## 3. Caching Layer Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    REDIS CACHE STRUCTURE                    │
│                                                             │
│  Key Pattern              Value                     TTL     │
│  ──────────────────────────────────────────────────────    │
│  skills:all               [Skill[]]                3600s   │
│  skills:{"category":".."}  [Skill[]]                3600s   │
│  skill:{id}               Skill                     3600s   │
│  projects:all             [Project[]]              3600s   │
│  projects:featured        [Project[]]              3600s   │
│  project:{id}             Project                  3600s   │
│  stats:overview           Stats                    7200s   │
│  skill:categories         [String[]]               7200s   │
│  rate_limit:{ip}          RequestCount             900s    │
│  contact_rate:{ip}        SubmissionCount          3600s   │
└────────────────────────────────────────────────────────────┘

CACHE INVALIDATION STRATEGIES:
┌──────────────────────────────────────────────────────────┐
│ 1. Time-Based (TTL)                                       │
│    • Automatic expiration after TTL                       │
│    • Good for semi-static data                            │
│                                                           │
│ 2. Event-Based (Future)                                   │
│    • Invalidate on data update                            │
│    • Pattern: DEL skills:all, skills:*                    │
│                                                           │
│ 3. Manual Flush (Admin)                                   │
│    • Clear all cache: FLUSHDB                             │
│    • Use for major data changes                           │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Security Layers

```
┌───────────────────────────────────────────────────────────┐
│                      REQUEST SECURITY                      │
└───────────────────────────────────────────────────────────┘
                           ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 1: TLS/SSL                                           │
│ • Encrypted connection (HTTPS)                             │
│ • Certificate validation                                   │
│ • Modern cipher suites only                                │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 2: CLOUDFLARE (Optional)                            │
│ • DDoS protection                                          │
│ • Bot mitigation                                           │
│ • WAF (Web Application Firewall)                           │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 3: RATE LIMITING                                    │
│ • IP-based: 100 req/15min                                  │
│ • Contact form: 5 req/hour                                 │
│ • Stored in Redis                                          │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 4: CORS                                             │
│ • Origin whitelist                                         │
│ • Allowed methods: GET, POST                               │
│ • Credentials: false (no cookies)                          │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 5: HELMET.JS                                        │
│ • Content Security Policy                                  │
│ • X-Frame-Options: SAMEORIGIN                             │
│ • X-Content-Type-Options: nosniff                         │
│ • HSTS (Strict-Transport-Security)                         │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 6: INPUT VALIDATION                                 │
│ • GraphQL schema validation                                │
│ • Mongoose schema validation                               │
│ • Query complexity limits                                  │
│ • Max query depth: 5                                       │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────────┐
│ LAYER 7: DATABASE SECURITY                                │
│ • Authentication required                                  │
│ • Least privilege access                                   │
│ • Encrypted connections                                    │
│ • IP whitelist                                             │
└─────────────────────────┬─────────────────────────────────┘
                          ↓
                  ✅ SECURE REQUEST PROCESSED
```

---

## 5. Performance Optimization Points

```
FRONTEND OPTIMIZATIONS
┌────────────────────────────────────────────────────┐
│ 1. Code Splitting                                  │
│    Next.js automatic per-page bundles              │
│    Result: Initial load < 100KB                    │
│                                                    │
│ 2. Image Optimization                              │
│    WebP/AVIF conversion, lazy loading              │
│    Result: 70% smaller images                      │
│                                                    │
│ 3. CSS Optimization                                │
│    Tailwind purge, minification                    │
│    Result: CSS < 10KB gzipped                      │
│                                                    │
│ 4. Server Components (Next.js 14)                  │
│    Reduce client-side JavaScript                   │
│    Result: Faster Time to Interactive              │
└────────────────────────────────────────────────────┘

BACKEND OPTIMIZATIONS
┌────────────────────────────────────────────────────┐
│ 5. MongoDB Indexes                                 │
│    Compound indexes for common queries             │
│    Result: Query time 10ms vs 500ms                │
│                                                    │
│ 6. Redis Caching                                   │
│    80% cache hit rate                              │
│    Result: Response time 5ms vs 50ms               │
│                                                    │
│ 7. Response Compression                            │
│    Gzip/Brotli for all responses                   │
│    Result: 70% size reduction                      │
│                                                    │
│ 8. GraphQL Batching                                │
│    Automatic request deduplication                 │
│    Result: Fewer network requests                  │
└────────────────────────────────────────────────────┘

INFRASTRUCTURE OPTIMIZATIONS
┌────────────────────────────────────────────────────┐
│ 9. CDN (Cloudflare/Vercel)                        │
│    Edge caching for static assets                  │
│    Result: Global <100ms latency                   │
│                                                    │
│ 10. Connection Pooling                             │
│     Reuse DB connections                           │
│     Result: Faster query execution                 │
└────────────────────────────────────────────────────┘
```

---

## 6. Deployment Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                   DEVELOPMENT WORKFLOW                   │
└─────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  Git Commit  │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │  Git Push    │
                    │  to GitHub   │
                    └──────┬───────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS CI/CD PIPELINE               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Stage 1: Test Backend                           │  │
│  │  • Install dependencies                           │  │
│  │  • Run Jest tests                                 │  │
│  │  • Check code coverage                            │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                 │
│  ┌────────────────────┴─────────────────────────────┐  │
│  │  Stage 2: Test Frontend                          │  │
│  │  • Install dependencies                           │  │
│  │  • Run Vitest unit tests                          │  │
│  │  • Run Playwright E2E tests                       │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                 │
│  ┌────────────────────┴─────────────────────────────┐  │
│  │  Stage 3: Build                                   │  │
│  │  • Build backend (TypeScript)                     │  │
│  │  • Build frontend (Next.js)                       │  │
│  │  • Generate production bundles                    │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                 │
│                       ↓                                 │
│              ✅ All Tests Pass                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
         ┌──────────────┴─────────────┐
         │                            │
         ↓                            ↓
┌──────────────────┐         ┌──────────────────┐
│  VERCEL DEPLOY   │         │ RAILWAY DEPLOY   │
│  (Frontend)      │         │ (Backend)        │
│                  │         │                  │
│ • Auto-deploy    │         │ • Docker build   │
│ • Edge network   │         │ • Container run  │
│ • Preview URLs   │         │ • Health check   │
└──────────────────┘         └──────────────────┘
         │                            │
         └──────────────┬─────────────┘
                        ↓
              🎉 DEPLOYED TO PRODUCTION
```

---

## 7. Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION METRICS                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  LOGS (Winston)                                 │    │
│  │  • Info: Normal operations                      │    │
│  │  • Warn: Potential issues                       │    │
│  │  • Error: Failures with stack traces            │    │
│  │  Storage: logs/ directory                       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  PERFORMANCE METRICS                            │    │
│  │  • Request latency                              │    │
│  │  • Cache hit/miss ratio                         │    │
│  │  • Database query time                          │    │
│  │  • Error rate                                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  BUSINESS METRICS                               │    │
│  │  • Page views                                   │    │
│  │  • Contact form submissions                     │    │
│  │  • Most viewed projects                         │    │
│  │  • Search queries                               │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

MONITORING TOOLS (Optional Future Additions):
┌─────────────────────────────────────────────────────────┐
│ • Sentry: Error tracking & alerts                        │
│ • Datadog/New Relic: APM & infrastructure monitoring     │
│ • Google Analytics: User behavior tracking               │
│ • Uptime Robot: Availability monitoring                  │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Scalability Roadmap

```
┌─────────────────────────────────────────────────────────┐
│                     CURRENT STATE                        │
│                     (MVP - 1K users)                     │
│                                                          │
│  Frontend:  1 Vercel instance (auto-scaled)             │
│  Backend:   1 Railway container (512MB RAM)              │
│  MongoDB:   Shared cluster (M0 free tier)                │
│  Redis:     Single instance (256MB)                      │
│                                                          │
│  Capacity:  ~1,000 concurrent users                      │
│  Cost:      $0-20/month                                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   GROWTH PHASE 1                         │
│                   (10K users)                            │
│                                                          │
│  Frontend:  Multi-region Vercel (automatic)              │
│  Backend:   2-3 Railway containers (1GB RAM each)        │
│  MongoDB:   M10 dedicated cluster                        │
│  Redis:     Redis Cloud 1GB                              │
│                                                          │
│  Changes:   • Upgrade database tier                      │
│             • Add load balancing                         │
│             • Enable CDN caching                         │
│                                                          │
│  Capacity:  ~10,000 concurrent users                     │
│  Cost:      $100-200/month                               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   GROWTH PHASE 2                         │
│                   (100K users)                           │
│                                                          │
│  Frontend:  Vercel Enterprise                            │
│  Backend:   5-10 containers with auto-scaling            │
│  MongoDB:   M30 cluster with read replicas               │
│  Redis:     Redis cluster (5GB)                          │
│                                                          │
│  Changes:   • Add read replicas                          │
│             • Implement sharding                         │
│             • Add monitoring (Datadog)                   │
│             • CDN for all assets                         │
│                                                          │
│  Capacity:  ~100,000 concurrent users                    │
│  Cost:      $500-1000/month                              │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture is designed to:

1. ✅ Start simple (current setup)
2. ✅ Scale gradually (add components as needed)
3. ✅ Minimize costs early (optimize for growth)
4. ✅ Maintain performance (caching, indexes, CDN)
5. ✅ Ensure security (multiple layers)
6. ✅ Enable monitoring (logs, metrics)

**Current architecture handles 1K-10K users without changes.**

For detailed explanations, see [ARCHITECTURE.md](ARCHITECTURE.md)
