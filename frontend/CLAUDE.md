# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup

- Use pnpm for package management (required, enforced by preinstall script)
- Install dependencies: `pnpm install`
- Node.js version defined in `.nvmrc` (use `nvm use`)

### Core Development

- Start dev server: `pnpm dev` (runs data-portal dev server with codegen and hot reload)
- Build all packages: `pnpm build`
- Clean builds: `pnpm clean`
- Clean node_modules: `pnpm clean:modules`
- Start production server: `pnpm start`

### Data Portal Package Commands

Run these from the data-portal package or use `pnpm data-portal <command>`:

- Dev server: `pnpm data-portal dev`
- Production build: `pnpm data-portal build`
- Generate GraphQL types: `pnpm data-portal build:codegen`
- Watch GraphQL codegen: `pnpm data-portal dev:codegen`

### Testing & Quality

- Run tests: `pnpm test` (Jest with coverage)
- Watch tests: `pnpm data-portal test:watch`
- E2E tests: `pnpm data-portal e2e` (Playwright)
- E2E debug mode: `pnpm data-portal e2e:debug`
- Install E2E browsers: `pnpm e2e:install-browsers`
- Lint all: `pnpm lint`
- Fix linting: `pnpm lint:fix`
- Type check: `pnpm data-portal type-check`

Individual linters:
- ESLint only: `pnpm lint:eslint` / `pnpm lint:eslint:fix`
- Prettier only: `pnpm lint:prettier` / `pnpm lint:prettier:fix`
- Stylelint only: `pnpm lint:stylelint` / `pnpm lint:stylelint:fix`

## Architecture Overview

### Monorepo Structure

- **packages/data-portal**: Main CryoET Data Portal web application (Remix + React)
- **packages/eslint-config**: Shared ESLint configuration
- **packages/eslint-plugin**: Custom ESLint rules

### Technology Stack

- **Framework**: Remix (React-based full-stack framework)
- **Styling**: Tailwind CSS + CSS Modules + Material-UI + Emotion
- **GraphQL**: Apollo Client with code generation
- **State Management**: Jotai (atomic state management)
- **Testing**: Jest (unit) + Playwright (E2E)
- **Internationalization**: i18next/react-i18next

### GraphQL Integration

- Uses Apollo Client with server-side rendering support
- GraphQL schema codegen generates types in `app/__generated_v2__/`
- Queries are colocated with components/routes in `app/graphql/`
- Schema URL: configured via `API_URL_V2` environment variable

### File Organization

- **app/routes/**: Remix route components and loaders
- **app/components/**: Reusable React components
- **app/graphql/**: GraphQL queries and fragments
- **app/hooks/**: Custom React hooks
- **app/utils/**: Utility functions and helpers
- **app/constants/**: Application constants
- **app/types/**: TypeScript type definitions
- **e2e/**: Playwright end-to-end tests

### Key Patterns

- Route-based data loading with Remix loaders
- Component-driven architecture with shared design system (@czi-sds/components)
- GraphQL queries use typed document nodes with fragment masking disabled
- Internationalization keys follow hierarchical structure in translation.json
- CSS Modules for component-specific styles, Tailwind for utilities
- CSS Module TypeScript definitions generated via typed-css-modules
- Build CSS types: `pnpm build:tcm` / Watch: `pnpm dev:tcm`

### Development Workflow

1. GraphQL codegen runs automatically during dev and must complete before other processes
2. Hot reload enabled for both client and server code
3. TypeScript compilation happens via ts-node for server, Remix handles client compilation
4. CSS Modules type definitions generated automatically via typed-css-modules

### Environment Configuration

- Environment variables injected via root loader for client-side access
- Supports multiple environments (dev, staging, prod) via ENV variable
- Plausible analytics integration with environment-specific domains
- Create `.env` file from `.env.sample` for local development
- Node.js v20.10.0 required (see `.nvmrc`)
- PNPM v8.10.5 enforced

### Testing Configuration

- Jest with ts-jest for ESM support
- Test timeout: 10 seconds
- Coverage reporting enabled by default
- E2E tests support video recording on failure
- Multiple browser support (Chromium, Firefox, WebKit)

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint extends Airbnb + TypeScript rules
- Prettier: no semicolons, single quotes, trailing commas
- Stylelint: enforces camelCase for CSS module classes
- CSS architecture: PostCSS with nesting, autoprefixer, Tailwind plugins
