# @portfolio/config

Shared configuration files for the monorepo.

## Included Configs

### ESLint

- `eslint-base.js` - Base ESLint config for all projects
- `eslint-react.js` - React-specific ESLint rules
- `eslint-next.js` - Next.js-specific ESLint rules

### TypeScript

- `tsconfig-base.json` - Base TypeScript config
- `tsconfig-next.json` - Next.js TypeScript config
- `tsconfig-node.json` - Node.js TypeScript config

### Tailwind CSS

- `tailwind-base.js` - Base Tailwind config with custom theme

## Usage

### ESLint

```js
// .eslintrc.js
module.exports = {
  extends: ['@portfolio/config/eslint-next'],
};
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "@portfolio/config/tsconfig-next.json"
}
```

### Tailwind

```js
// tailwind.config.js
module.exports = {
  presets: [require('@portfolio/config/tailwind-base')],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```
