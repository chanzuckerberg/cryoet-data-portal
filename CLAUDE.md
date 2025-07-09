# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

CryoET Data Portal is a monorepo containing:

- **frontend/**: React/Remix web application (pnpm monorepo)
- **client/python/**: Python API client library
- **docs/**: Sphinx documentation
- **utilities/**: Utility scripts
- **website-docs/**: Static documentation pages

## Common Development Commands

### Frontend Development

```bash
# Setup
cd frontend/
nvm use                          # Use Node version from .nvmrc
pnpm install                     # Install dependencies

# Development
pnpm dev                         # Start dev server with hot reload
pnpm build                       # Build all packages
pnpm test                        # Run Jest tests
pnpm e2e                         # Run Playwright E2E tests
pnpm lint                        # Run all linters
pnpm lint:fix                    # Auto-fix linting issues
pnpm type-check                  # TypeScript type checking

# Data Portal specific
pnpm data-portal dev             # Run only data-portal dev server
pnpm data-portal build:codegen   # Generate GraphQL types
pnpm data-portal test:watch      # Watch mode for tests
pnpm data-portal e2e:debug       # Debug E2E tests
```

### Python Client Development

```bash
cd client/python/cryoet_data_portal/
pip install -e .                 # Install in development mode
make test-infra                  # Set up test infrastructure
make coverage                    # Run tests with coverage
```

### Testing

```bash
# Frontend unit tests
cd frontend && pnpm test

# Frontend E2E tests
cd frontend && pnpm e2e

# Python tests
cd client/python/cryoet_data_portal && make coverage
```

## Architecture Overview

### Frontend Architecture

The frontend uses:

- **Remix**: Full-stack React framework with SSR
- **TypeScript**: Strict mode enabled
- **GraphQL**: Apollo Client with automatic type generation
- **Styling**: Tailwind CSS + CSS Modules + Material-UI
- **State**: Jotai for atomic state management
- **i18n**: i18next for internationalization

Key patterns:

- Route-based code splitting via Remix
- Server-side data loading in route loaders
- GraphQL-first API approach with generated types
- Component-driven architecture using CZI design system

### File Structure

```
frontend/packages/data-portal/app/
├── routes/              # Remix routes (pages)
├── components/          # Reusable React components
├── graphql/            # GraphQL queries/fragments
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── constants/          # App constants
├── types/              # TypeScript types
├── state/              # Jotai atoms
└── __generated_v2__/   # GraphQL generated types
```

### GraphQL Integration

- Schema endpoint configured via `API_URL_V2` environment variable
- Types auto-generated to `app/__generated_v2__/`
- Queries colocated with components in `app/graphql/`
- Fragment masking disabled for simpler type usage

### Python Client

The Python client provides programmatic access to the CryoET Data Portal API:

- Supports Python 3.7-3.12
- GraphQL client using gql library
- AWS S3 integration for data downloads
- Type hints throughout

## Key Development Workflows

### Adding a New Feature

1. For GraphQL changes: Update queries in `app/graphql/`, run `pnpm data-portal build:codegen`
2. Create/modify components in `app/components/`
3. Add route if needed in `app/routes/`
4. Write tests alongside implementation
5. Run `pnpm lint:fix` and `pnpm type-check` before committing

### Working with Translations

- Translation keys in `public/locales/en/translation.json`
- Use hierarchical keys (e.g., `datasets.title`)
- Access via `useTranslation()` hook

### CSS Guidelines

- Use Tailwind utilities for common styles
- CSS Modules for component-specific styles
- Follow existing patterns in the codebase

## CI/CD

GitHub Actions workflows handle:

- Linting and type checking on all PRs
- Unit and E2E tests
- Python client testing across multiple versions
- Documentation builds
- Automated releases via release-please

## Environment Configuration

- Development server uses `.env` files
- Production config via environment variables
- Key variables:
  - `API_URL_V2`: GraphQL endpoint
  - `ENV`: Environment name (dev/staging/prod)
  - `PLAUSIBLE_*`: Analytics configuration
