# 📋 Monorepo Migration Checklist

Use this checklist to track your progress through the migration.

## Pre-Migration

- [ ] **Backup your code**

  ```bash
  git commit -am "Backup before monorepo migration"
  # or
  cp -r . ../portfolio1-backup
  ```

- [ ] **Review the setup**
  - [ ] Read `MONOREPO_COMPLETE.md`
  - [ ] Read `TURBOREPO_SETUP_GUIDE.md`
  - [ ] Understand the new structure

- [ ] **Verify prerequisites**
  - [ ] Node.js 18+ installed
  - [ ] npm 9+ installed
  - [ ] Git installed
  - [ ] MongoDB running (if testing locally)
  - [ ] Redis running (if testing locally)

## Migration Process

### Step 1: Run Migration Script

- [ ] Open PowerShell in project root
- [ ] Run `.\migrate-to-monorepo.ps1`
- [ ] Review the output for any errors
- [ ] Verify files moved correctly:
  - [ ] Documentation files in `docs/`
  - [ ] Docker files in `docker/`
  - [ ] Frontend code in `apps/web/src/`
  - [ ] Backend code in `apps/api/src/`

### Step 2: Install Dependencies

- [ ] Run `npm install` in project root
- [ ] Wait for installation to complete (may take 3-5 minutes)
- [ ] Verify no installation errors
- [ ] Check that all workspaces installed:
  ```bash
  ls apps/web/node_modules    # Should exist
  ls apps/api/node_modules    # Should exist
  ls packages/ui/node_modules # Should exist
  ```

### Step 3: Update Import Paths

#### Frontend (apps/web)

- [ ] Update component imports to use @portfolio/ui

  ```typescript
  // Before
  import Button from '../components/Button';

  // After
  import { Button } from '@portfolio/ui';
  ```

- [ ] Update type imports to use @portfolio/types

  ```typescript
  // Before
  import { Project } from '../types';

  // After
  import { Project } from '@portfolio/types';
  ```

- [ ] Update utility imports to use @portfolio/utils

  ```typescript
  // Before
  import { formatDate } from '../utils/date';

  // After
  import { formatDate } from '@portfolio/utils';
  ```

- [ ] Update internal imports to use @ alias

  ```typescript
  // Before
  import Component from '../components/Component';

  // After
  import Component from '@/components/Component';
  ```

#### Backend (apps/api)

- [ ] Update type imports to use @portfolio/types

  ```typescript
  // Before
  import { Project } from '../types';

  // After
  import { Project } from '@portfolio/types';
  ```

- [ ] Update utility imports to use @portfolio/utils

  ```typescript
  // Before
  import { formatDate } from '../utils/date';

  // After
  import { formatDate } from '@portfolio/utils';
  ```

- [ ] Update internal imports to use @ alias

  ```typescript
  // Before
  import Project from '../models/Project';

  // After
  import Project from '@/models/Project';
  ```

### Step 4: Environment Configuration

- [ ] Create `apps/web/.env.local`:

  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000
  NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
  ```

- [ ] Create/update `apps/api/.env`:
  ```env
  NODE_ENV=development
  PORT=5000
  DATABASE_URL=mongodb://localhost:27017/portfolio
  REDIS_URL=redis://localhost:6379
  JWT_SECRET=your-secret-key-change-in-production
  ADMIN_TOKEN=dev-admin-token
  CORS_ORIGIN=http://localhost:3000
  ```

### Step 5: Test Development Mode

- [ ] Start development servers: `npm run dev`
- [ ] Verify frontend runs without errors
  - [ ] Open http://localhost:3000
  - [ ] Check browser console for errors
  - [ ] Verify pages load correctly
- [ ] Verify backend runs without errors
  - [ ] Check terminal for startup logs
  - [ ] Open http://localhost:5000/graphql
  - [ ] Try a test query
- [ ] Verify hot reload works
  - [ ] Make a small change in frontend
  - [ ] Verify page updates automatically
  - [ ] Make a small change in backend
  - [ ] Verify server restarts

### Step 6: Replace Duplicate Code

- [ ] Replace local UI components with @portfolio/ui
  - [ ] Identify duplicate Button components
  - [ ] Identify duplicate Card components
  - [ ] Identify duplicate form components
  - [ ] Replace with shared components
- [ ] Replace local type definitions with @portfolio/types
  - [ ] Find duplicate Project types
  - [ ] Find duplicate Skill types
  - [ ] Replace with shared types
- [ ] Replace local utilities with @portfolio/utils
  - [ ] Find duplicate date functions
  - [ ] Find duplicate string functions
  - [ ] Replace with shared utilities

### Step 7: Testing

- [ ] Run type checking: `npm run type-check`
  - [ ] Fix any type errors
- [ ] Run linting: `npm run lint`
  - [ ] Fix any linting errors
- [ ] Run tests: `npm run test`
  - [ ] Fix any failing tests
  - [ ] Update test imports if needed
- [ ] Test build process: `npm run build`
  - [ ] Verify build succeeds
  - [ ] Check build outputs

### Step 8: Docker Setup (Optional)

- [ ] Review `docker/docker-compose.yml`
- [ ] Update environment variables if needed
- [ ] Test Docker setup: `npm run docker:up`
- [ ] Verify all services start:
  - [ ] MongoDB (port 27017)
  - [ ] Redis (port 6379)
  - [ ] API (port 5000)
  - [ ] Web (port 3000)
- [ ] Test application in Docker
- [ ] Stop services: `npm run docker:down`

## Post-Migration

### Cleanup

- [ ] Remove old directories (if migration successful):

  ```bash
  rm -rf frontend/
  rm -rf backend/
  # Only after verifying everything works!
  ```

- [ ] Update `.gitignore` if needed
- [ ] Clean up any temporary files

### Documentation

- [ ] Update README.md with new structure (already done)
- [ ] Update any custom documentation
- [ ] Document any custom import patterns
- [ ] Update team documentation

### Version Control

- [ ] Stage all changes: `git add .`
- [ ] Review changes: `git status`
- [ ] Commit: `git commit -m "Migrate to Turborepo monorepo"`
- [ ] Push to remote (after verification)

### Team Onboarding

- [ ] Share TURBOREPO_SETUP_GUIDE.md with team
- [ ] Share QUICK_REFERENCE.md for daily use
- [ ] Schedule team walkthrough (if applicable)
- [ ] Document any project-specific changes

## Verification Checklist

### Structure Verification

- [ ] `apps/web/` exists with source code
- [ ] `apps/api/` exists with source code
- [ ] `packages/ui/` exists with components
- [ ] `packages/types/` exists with types
- [ ] `packages/utils/` exists with utilities
- [ ] `packages/config/` exists with configs
- [ ] `docs/` exists with documentation
- [ ] `docker/` exists with Docker files

### Configuration Verification

- [ ] `package.json` has workspace configuration
- [ ] `turbo.json` has pipeline configuration
- [ ] `tsconfig.json` exists in root
- [ ] All apps have their own `package.json`
- [ ] All packages have their own `package.json`
- [ ] Environment files exist and are correct

### Functionality Verification

- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Shared packages work correctly
- [ ] Path aliases work correctly
- [ ] Hot reload works
- [ ] Docker setup works (if using)

### Performance Verification

- [ ] Build time is acceptable
- [ ] Hot reload is fast (<1s)
- [ ] Type checking is fast (<5s)
- [ ] Turbo caching works (second build instant)

## Troubleshooting

If you encounter issues, refer to:

- [ ] **TURBOREPO_SETUP_GUIDE.md** - Comprehensive troubleshooting
- [ ] **QUICK_REFERENCE.md** - Common commands
- [ ] **MONOREPO_COMPLETE.md** - Complete setup guide

Common fixes:

```bash
# Clear everything and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo
npm install

# Force rebuild without cache
turbo run build --force

# Clear Turbo cache
turbo run clean
```

## Success Criteria

✅ **Migration is successful when:**

- All apps start without errors
- All imports work correctly
- All tests pass
- Build process completes
- Hot reload works
- Shared packages are being used
- No duplicate code remains
- Team can develop without issues

## Timeline Estimate

- **Pre-Migration:** 30 minutes (reading documentation)
- **Migration Script:** 5 minutes (automatic)
- **Import Updates:** 1-2 hours (depending on project size)
- **Testing:** 30 minutes
- **Docker Setup:** 15 minutes (optional)
- **Cleanup:** 15 minutes

**Total: 3-4 hours** for complete migration and verification

---

## 📞 Need Help?

- Check **TURBOREPO_SETUP_GUIDE.md** for detailed instructions
- Review **QUICK_REFERENCE.md** for common commands
- Read **MONOREPO_COMPLETE.md** for feature explanations
- Check **ARCHITECTURE_DIAGRAM.md** for visual structure

---

**🎉 Once all checkboxes are ticked, your migration is complete!**

Save this checklist and tick off items as you complete them.
