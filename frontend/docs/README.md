# CryoET Data Portal Frontend Documentation

Welcome to the CryoET Data Portal frontend documentation! This comprehensive guide will help you understand and contribute to the frontend codebase effectively.

**Last updated:** December 10, 2025

## About This Documentation

This documentation covers everything you need to work productively with the CryoET Data Portal frontend. Whether you're joining the team, working across the stack, or contributing to the open-source project, you'll find the resources you need here.

The frontend is a modern React application built with Remix, TypeScript, GraphQL, and Tailwind CSS. It follows established patterns and best practices to ensure maintainability and performance.

---

## Documentation Structure

This documentation is organized into focused sections that build upon each other:

| Section | Description | Files |
|---------|-------------|-------|
| [**00-getting-started**](./00-getting-started/) | Essential onboarding to run the app locally and understand the codebase structure | 5 files |
| [**01-architecture**](./01-architecture/) | Core technical decisions and how major systems work together | 7 files |
| [**02-patterns**](./02-patterns/) | Detailed documentation of recurring patterns used throughout the codebase | 8 files |
| [**03-development**](./03-development/) | Step-by-step guides for common development tasks | 7 files |
| [**04-reference**](./04-reference/) | Quick-lookup reference documentation for APIs, types, and configuration | 6 files |
| [**05-troubleshooting**](./05-troubleshooting/) | Solutions to common problems developers encounter | 4 files |
| [**06-contributing**](./06-contributing/) | Guidelines for contributing to the project | 4 files |
| [**07-appendix**](./07-appendix/) | Supplementary material including glossary and external resources | 2 files |

---

## Quick Links

### Getting Started
- [Prerequisites](./00-getting-started/01-prerequisites.md)
- [Local Development Setup](./00-getting-started/02-local-development-setup.md)
- [Project Structure](./00-getting-started/03-project-structure.md)
- [Development Workflow](./00-getting-started/04-development-workflow.md)
- [Codebase Tour](./00-getting-started/05-codebase-tour.md)

### Architecture
- [Technology Stack](./01-architecture/01-technology-stack.md)
- [Remix Patterns](./01-architecture/02-remix-patterns.md)
- [GraphQL Integration](./01-architecture/03-graphql-integration.md)
- [State Management](./01-architecture/04-state-management.md)
- [Styling System](./01-architecture/05-styling-system.md)
- [Feature Flags](./01-architecture/06-feature-flags.md)
- [Data Model](./01-architecture/07-data-model.md)

### Patterns
- [Component Patterns](./02-patterns/01-component-patterns.md)
- [Filter System](./02-patterns/02-filter-system.md)
- [Table Page Layout](./02-patterns/03-table-page-layout.md)
- [Metadata Drawers](./02-patterns/04-metadata-drawers.md)
- [Download Modal](./02-patterns/05-download-modal.md)
- [Error Handling](./02-patterns/06-error-handling.md)
- [Internationalization](./02-patterns/07-internationalization.md)
- [Hooks Guide](./02-patterns/08-hooks-guide.md)

### Development Guides
- [Adding New Routes](./03-development/01-adding-new-routes.md)
- [Adding New Components](./03-development/02-adding-new-components.md)
- [GraphQL Queries](./03-development/03-graphql-queries.md)
- [Adding Filters](./03-development/04-adding-filters.md)
- [Styling Guide](./03-development/05-styling-guide.md)
- [Testing Guide](./03-development/06-testing-guide.md)
- [Feature Flag Guide](./03-development/07-feature-flag-guide.md)

### Reference
- [Query Parameters](./04-reference/01-query-params.md)
- [Environment Variables](./04-reference/02-environment-variables.md)
- [Constants Reference](./04-reference/03-constants-reference.md)
- [Type Definitions](./04-reference/04-type-definitions.md)
- [GraphQL Schema](./04-reference/05-graphql-schema.md)
- [API Routes](./04-reference/06-api-routes.md)

### Troubleshooting
- [Debugging Guide](./05-troubleshooting/02-debugging-guide.md)
- [GraphQL Debugging](./05-troubleshooting/03-graphql-debugging.md)
- [Styling Issues](./05-troubleshooting/04-styling-issues.md)
- [Build Errors](./05-troubleshooting/05-build-errors.md)

### Contributing
- [Code Style](./06-contributing/01-code-style.md)
- [PR Guidelines](./06-contributing/02-pr-guidelines.md)
- [Commit Conventions](./06-contributing/03-commit-conventions.md)
- [Release Process](./06-contributing/04-release-process.md)

### Appendix
- [Glossary](./07-appendix/01-glossary.md)
- [External Resources](./07-appendix/02-external-resources.md)

---

## Getting Help

If you can't find what you're looking for in this documentation:

1. Search the codebase for examples of similar functionality
2. Ask in the team chat or GitHub Discussions
3. Open an issue if you've found a documentation gap

---

## Contributing to Documentation

Found an error or want to improve the documentation? We welcome contributions!

- Documentation source: `/frontend/docs/`
- Follow the same style and structure as existing docs
- Include code examples with file path references
- Keep documents focused and split if they grow too large
- Update the "Last updated" date when making changes

See [PR Guidelines](./06-contributing/02-pr-guidelines.md) for the contribution process.
