# @portfolio/utils

Shared utility functions for the monorepo.

## Installation

Utils are automatically available to all workspace packages via path aliases.

## Usage

```typescript
import { formatDate, formatNumber, truncate, debounce, groupBy } from '@portfolio/utils';
```

## Included Utilities

### Date Utils (`date.ts`)

- `formatDate()` - Format dates
- `getRelativeTime()` - Relative time (e.g., "2 hours ago")
- `formatDuration()` - Format duration in months
- `calculateDuration()` - Calculate duration between dates

### Number Utils (`number.ts`)

- `formatNumber()` - Format with thousand separators
- `formatPercent()` - Format as percentage
- `formatCompactNumber()` - Format with K/M/B suffixes
- `clamp()` - Clamp between min/max
- `randomInt()` - Random integer
- `average()` - Calculate average
- `roundTo()` - Round to decimal places

### String Utils (`string.ts`)

- `truncate()` - Truncate string
- `capitalize()` - Capitalize first letter
- `titleCase()` - Convert to title case
- `slugify()` - Convert to URL-friendly slug
- `stripHtml()` - Remove HTML tags
- `randomString()` - Generate random string
- `isValidEmail()` - Validate email
- `isValidUrl()` - Validate URL
- `extractDomain()` - Extract domain from URL

### Async Utils (`async.ts`)

- `debounce()` - Debounce function
- `throttle()` - Throttle function
- `sleep()` - Sleep/delay
- `retry()` - Retry with exponential backoff

### Array Utils (`array.ts`)

- `groupBy()` - Group items by key
- `unique()` - Remove duplicates
- `chunk()` - Split into chunks
- `shuffle()` - Shuffle randomly
- `randomItem()` - Get random item
- `sortBy()` - Sort by key
