# @portfolio/ui

Shared React UI components with Tailwind CSS and styled-components.

## Features

- 🎨 Styled with Tailwind + styled-components
- ♿ Accessible components
- 🌗 Dark mode support
- 📱 Responsive design
- ⚡ Optimized for performance

## Installation

Components are automatically available to all workspace apps via path aliases.

## Usage

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Spinner,
  Input,
} from '@portfolio/ui';

function MyComponent() {
  return (
    <Card hover>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input label="Email" type="email" fullWidth />
        <Button variant="primary" size="lg" fullWidth>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Components

### Button

Versatile button component with multiple variants and sizes.

**Variants:** `primary`, `secondary`, `outline`, `ghost`  
**Sizes:** `sm`, `md`, `lg`

```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Card

Container component with optional hover effect.

```tsx
<Card hover padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Badge

Small status indicator component.

**Variants:** `default`, `primary`, `success`, `warning`, `danger`  
**Sizes:** `sm`, `md`, `lg`

```tsx
<Badge variant="success" size="sm">
  Active
</Badge>
```

### Spinner

Loading indicator.

**Sizes:** `sm`, `md`, `lg`

```tsx
<Spinner size="md" color="#0ea5e9" />
```

### Input

Form input with label, error, and helper text support.

```tsx
<Input
  label="Username"
  placeholder="Enter username"
  error="Username is required"
  helperText="Must be unique"
  fullWidth
/>
```

## Theming

All components support dark mode automatically via `prefers-color-scheme`.

## Development

```bash
# Type check
npm run type-check

# Lint
npm run lint
```
