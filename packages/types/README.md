# @portfolio/types

Shared TypeScript type definitions for the monorepo.

## Installation

Types are automatically available to all workspace packages via path aliases.

## Usage

```typescript
import {
  Project,
  Skill,
  ContactMessage,
  Analytics,
  LeaderboardEntry,
  ProjectCategory,
  SkillCategory,
  MessageStatus,
} from '@portfolio/types';
```

## Included Types

### Core Types

- `Project` - Portfolio project with full metadata
- `Skill` - Technical skill with proficiency tracking
- `ContactMessage` - Contact form submission
- `Analytics` - Time-series analytics data
- `LeaderboardEntry` - Game leaderboard score

### Enums

- `ProjectCategory`, `ProjectStatus`
- `SkillCategory`, `SkillStatus`
- `MessageStatus`
- `GameMode`, `GameType`
- `PeriodType`
- `UserRole`
- `SortOrder`

### API Types

- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - Error format
- `Connection<T>` - Relay-style pagination
- `Edge<T>`, `PageInfo` - Pagination helpers
- `PaginationInput` - Pagination params

### Filter Types

- `ProjectFilter` - Filter projects
- `SkillFilter` - Filter skills
- `LeaderboardFilter` - Filter leaderboard entries

### Other

- `User` - Authenticated user
- `GraphQLContext` - GraphQL context type
- `SortInput` - Sorting parameters
