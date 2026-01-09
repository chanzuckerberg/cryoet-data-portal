# Development Workflow

This guide covers the daily commands and workflows for developing on the CryoET Data Portal frontend.

> **Prerequisites**: Ensure you have completed [Local Development Setup](./02-local-development-setup.md) before continuing.

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `pnpm dev` |
| Run unit tests | `pnpm test` |
| Run tests in watch mode | `pnpm test:watch` |
| Run E2E tests | `pnpm e2e` |
| Debug E2E tests | `pnpm e2e:debug` |
| Fix lint issues | `pnpm lint:fix` |
| Type check | `pnpm type-check` |
| Build for production | `pnpm build` |
| Generate GraphQL types | `pnpm build:codegen` |

## Development Server

Start the development server:

```bash
pnpm dev
```

This runs three concurrent processes:

1. **GraphQL Codegen** (`dev:codegen`) - Watches GraphQL documents and regenerates TypeScript types to `app/__generated_v2__/`
2. **Remix Dev Server** (`dev:remix`) - Hot reloads React components and routes
3. **CSS Modules TypeScript** (`dev:tcm`) - Generates type definitions for `.module.css` files

The server is available at [http://localhost:8080](http://localhost:8080).

### Hot Reload Behavior

- **React components**: Instant reload via Remix
- **GraphQL queries**: Types regenerate automatically when `.ts`/`.tsx` files with queries change
- **CSS Modules**: TypeScript definitions regenerate when `.module.css` files change
- **Server code**: Restarts when `server.ts` is modified

## Testing

### Unit Tests

Run all unit tests with coverage:

```bash
pnpm test
```

Run tests in watch mode during development:

```bash
pnpm test:watch
```

Tests use Jest with jsdom environment. Test files follow these patterns:
- `*.test.ts` / `*.test.tsx`
- `*.spec.ts` / `*.spec.tsx`

### E2E Tests

Run end-to-end tests with Playwright:

```bash
pnpm e2e
```

Debug tests in Playwright's UI mode:

```bash
pnpm e2e:debug
```

Run a specific browser:

```bash
E2E_BROWSER=chromium pnpm e2e
E2E_BROWSER=firefox pnpm e2e
E2E_BROWSER=webkit pnpm e2e
```

### E2E Configuration

E2E tests use configuration from `e2e/config.json`. You can override values via the `E2E_CONFIG` environment variable in your `.env` file.

**Important**: The base config contains placeholder values for `authorName` and `authorOrcId` that must be replaced with real values for author filter tests to pass.

To configure:

1. Copy `.env.sample` to `.env` if you haven't already:
   ```bash
   cp packages/data-portal/.env.sample packages/data-portal/.env
   ```

2. Find a real author name and ORCID from the [CryoET Data Portal](https://cryoetdataportal.czscience.com/browse-data/datasets) by browsing datasets and viewing author information

3. Update `E2E_CONFIG` in your `.env` file:
   ```
   E2E_CONFIG={"authorName":"Author Name","authorOrcId":"0000-0000-0000-0000"}
   ```

The `E2E_CONFIG` JSON is merged with the base `e2e/config.json`, so you only need to specify values you want to override.

## Code Quality

### Run All Checks

Run ESLint, Prettier, and Stylelint together:

```bash
pnpm lint
```

Auto-fix issues:

```bash
pnpm lint:fix
```

### Individual Tools

**ESLint** (JavaScript/TypeScript):

```bash
pnpm lint:eslint        # Check
pnpm lint:eslint:fix    # Fix
```

**Prettier** (Formatting):

```bash
pnpm lint:prettier      # Check
pnpm lint:prettier:fix  # Fix
```

**Stylelint** (CSS):

```bash
pnpm lint:stylelint     # Check
pnpm lint:stylelint:fix # Fix
```

**TypeScript** (Type checking):

```bash
pnpm type-check
```

## Build

Build the application for production:

```bash
pnpm build
```

This runs these steps in sequence:

1. `build:codegen` - Generate GraphQL TypeScript types
2. `build:neuroglancer` - Build the neuroglancer package
3. `build:tcm` - Generate CSS Module type definitions
4. `build:remix` - Build the Remix production bundle

To regenerate GraphQL types after changing queries:

```bash
pnpm build:codegen
```

## Before Committing

There are no pre-commit hooks, so run these checks manually before committing:

```bash
# Fix formatting and lint issues
pnpm lint:fix

# Verify no type errors
pnpm type-check

# Run unit tests
pnpm test

# Optionally run E2E tests
pnpm e2e
```

## Next Steps

Continue to [Application Entry Points](../01-architecture/00-foundation/02-application-entry-points.md) to understand how the app bootstraps, or [Component Architecture](../01-architecture/04-components/01-component-architecture.md) for an overview of the component organization.
