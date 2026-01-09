# CryoET Data Portal Frontend Documentation

Welcome to the CryoET Data Portal frontend documentation! This comprehensive guide will help you understand and contribute to the frontend codebase effectively.

## About This Documentation

This documentation covers everything you need to work productively with the CryoET Data Portal frontend. Whether you're joining the team, working across the stack, or contributing to the open-source project, you'll find the resources you need here.

The frontend is a modern React application built with Remix, TypeScript, GraphQL, and Tailwind CSS. It follows established patterns and best practices to ensure maintainability and performance.

---

## Documentation Structure

This documentation is organized into focused sections that build upon each other:

| Section                                         | Description                                                                       | Files    |
| ----------------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| [**00-getting-started**](./00-getting-started/) | Essential onboarding to run the app locally and understand the codebase structure | 4 files  |
| [**01-architecture**](./01-architecture/)       | Core technical decisions, patterns, and how major systems work together           | 20 files |
| [**03-development**](./03-development/)         | Step-by-step guides for common development tasks                                  | 5 files  |
| [**04-reference**](./04-reference/)             | Quick-lookup reference documentation for APIs, types, and configuration           | 6 files  |
| [**05-contributing**](./05-contributing/)       | Guidelines for contributing to the project                                        | 6 files  |
| [**07-appendix**](./07-appendix/)               | Supplementary material including glossary and external resources                  | 2 files  |

---

## Quick Links

### Getting Started

- [Prerequisites](./00-getting-started/01-prerequisites.md)
- [Local Development Setup](./00-getting-started/02-local-development-setup.md)
- [Project Structure](./00-getting-started/03-project-structure.md)
- [Development Workflow](./00-getting-started/04-development-workflow.md)

### Architecture

Architecture documentation is organized by topic:

#### Foundation

- [Technology Stack](./01-architecture/00-foundation/01-technology-stack.md)
- [Application Entry Points](./01-architecture/00-foundation/02-application-entry-points.md)

#### Routing

- [Remix Fundamentals](./01-architecture/01-routing/01-remix-fundamentals.md)
- [Route Patterns](./01-architecture/01-routing/02-route-patterns.md)

#### Data

- [GraphQL Integration](./01-architecture/02-data/01-graphql-integration.md)
- [Data Model](./01-architecture/02-data/02-data-model.md)
- [Filter System](./01-architecture/02-data/03-filter-system.md)
- [Deposition Data Fetching](./01-architecture/02-data/04-deposition-data-fetching.md)

#### State

- [State Management](./01-architecture/03-state/01-state-management.md)

#### Components

- [Component Architecture](./01-architecture/04-components/01-component-architecture.md)
- [Table Page Layout](./01-architecture/04-components/02-table-page-layout.md)
- [Metadata Drawers](./01-architecture/04-components/03-metadata-drawers.md)
- [Download Modal](./01-architecture/04-components/04-download-modal.md)

#### Styling

- [Styling System](./01-architecture/05-styling/01-styling-system.md)

#### Cross-Cutting Concerns

- [Error Handling](./01-architecture/06-cross-cutting/01-error-handling.md)
- [Internationalization](./01-architecture/06-cross-cutting/02-internationalization.md)
- [Hooks Guide](./01-architecture/06-cross-cutting/03-hooks-guide.md)
- [Feature Flags](./01-architecture/06-cross-cutting/04-feature-flags.md)
- [Analytics](./01-architecture/06-cross-cutting/05-analytics.md)

### Development Guides

- [Adding New Routes](./03-development/01-adding-new-routes.md)
- [Adding New Components](./03-development/02-adding-new-components.md)
- [GraphQL Queries](./03-development/03-graphql-queries.md)
- [Adding Filters](./03-development/04-adding-filters.md)
- [Styling System](./01-architecture/05-styling/01-styling-system.md)
- [Testing Guide](./03-development/06-testing-guide.md)

### Reference

- [Query Parameters](./04-reference/01-query-params.md)
- [Environment Variables](./04-reference/02-environment-variables.md)
- [Constants Reference](./04-reference/03-constants-reference.md)
- [Type Definitions](./04-reference/04-type-definitions.md)
- [GraphQL Schema](./04-reference/05-graphql-schema.md)
- [API Routes](./04-reference/06-api-routes.md)

### Contributing

- [Code Style](./05-contributing/01-code-style.md)
- [PR Guidelines](./05-contributing/02-pr-guidelines.md)
- [Commit Conventions](./05-contributing/03-commit-conventions.md)
- [Release Process](./05-contributing/04-release-process.md)
- [GitHub Actions & Deployment](./05-contributing/05-github-actions-deployment.md)
- [Claude Code Commands](./05-contributing/06-claude-code-commands.md)

### Appendix

- [Glossary](./07-appendix/01-glossary.md)
- [External Resources](./07-appendix/02-external-resources.md)

---

## Getting Help

If you can't find what you're looking for in this documentation:

1. Search the codebase for examples of similar functionality
2. Ask in the team chat or GitHub Discussions
3. Open an issue if you've found a documentation gap

## Contributing to Documentation

Found an error or want to improve the documentation? We welcome contributions!

- Documentation source: `/frontend/docs/`
- Follow the same style and structure as existing docs
- Include code examples with file path references
- Keep documents focused and split if they grow too large

See [PR Guidelines](./05-contributing/02-pr-guidelines.md) for the contribution process.
