# External Resources

This document provides links to external documentation for the technologies, frameworks, and tools used in the CryoET Data Portal frontend. Use these resources to deepen your understanding of the stack.

**Last updated:** December 10, 2025

---

## Core Framework & Runtime

| Technology     | Version | Official Documentation                                          | Notes                                                                                                    |
| -------------- | ------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Node.js**    | 20.10.0 | [nodejs.org/docs](https://nodejs.org/docs/latest-v20.x/api/)    | LTS runtime environment. Version specified in `.nvmrc`.                                                  |
| **pnpm**       | 8.10.5  | [pnpm.io](https://pnpm.io/)                                     | Fast, disk-efficient package manager. Enforced via preinstall script.                                    |
| **Remix**      | 2.17.0  | [remix.run/docs](https://remix.run/docs/en/2.17.0)              | Full-stack React framework with SSR. See also [Remix Patterns](../01-architecture/02-remix-patterns.md). |
| **React**      | 18.2.0  | [react.dev](https://react.dev/)                                 | UI library. Using React 18 features including concurrent rendering.                                      |
| **TypeScript** | 5.2.2   | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Strict mode enabled. See `tsconfig.json` for configuration.                                              |
| **Express**    | 4.21.1  | [expressjs.com](https://expressjs.com/)                         | HTTP server for Remix SSR.                                                                               |

---

## GraphQL & Data Fetching

| Technology                       | Version | Official Documentation                                                                                         | Notes                                                                                                     |
| -------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **GraphQL**                      | 16.8.1  | [graphql.org/learn](https://graphql.org/learn/)                                                                | Query language for API.                                                                                   |
| **Apollo Client**                | 3.8.5   | [apollographql.com/docs/react](https://www.apollographql.com/docs/react/)                                      | GraphQL client with SSR support. See [GraphQL Integration](../01-architecture/03-graphql-integration.md). |
| **GraphQL Code Generator**       | 5.0.0   | [graphql-code-generator.com](https://the-guild.dev/graphql/codegen)                                            | Generates TypeScript types from schema. Config in `codegen.ts`.                                           |
| **@graphql-typed-document-node** | 3.2.0   | [github.com/dotansimha/graphql-typed-document-node](https://github.com/dotansimha/graphql-typed-document-node) | Typed GraphQL document nodes for type safety.                                                             |
| **TanStack Query**               | 5.83.0  | [tanstack.com/query](https://tanstack.com/query/latest)                                                        | Server state management for REST endpoints (non-GraphQL data).                                            |

---

## State Management

| Technology | Version | Official Documentation          | Notes                                                                                       |
| ---------- | ------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Jotai**  | 2.4.3   | [jotai.org](https://jotai.org/) | Atomic state management. See [State Management](../01-architecture/04-state-management.md). |

---

## Styling

| Technology              | Version | Official Documentation                                                                       | Notes                                                                    |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Tailwind CSS**        | 3.3.3   | [tailwindcss.com/docs](https://tailwindcss.com/docs)                                         | Utility-first CSS framework. Primary styling approach.                   |
| **Material-UI (MUI)**   | 5.14.13 | [mui.com/material-ui](https://mui.com/material-ui/)                                          | React component library. Use components but prefer Tailwind for styling. |
| **@mui/icons-material** | 5.14.13 | [mui.com/material-ui/material-icons](https://mui.com/material-ui/material-icons/)            | Icon library.                                                            |
| **CZI SDS**             | 22.3.2  | [github.com/chanzuckerberg/sci-components](https://github.com/chanzuckerberg/sci-components) | CZI Science Design System. Design tokens integrated via Tailwind.        |
| **Emotion**             | 11.11.1 | [emotion.sh/docs](https://emotion.sh/docs/introduction)                                      | CSS-in-JS library. Used for MUI integration and SSR style extraction.    |
| **PostCSS**             | 8.4.31  | [postcss.org](https://postcss.org/)                                                          | CSS transformation pipeline.                                             |
| **Autoprefixer**        | 10.4.16 | [github.com/postcss/autoprefixer](https://github.com/postcss/autoprefixer)                   | Adds vendor prefixes automatically.                                      |

---

## Testing

| Technology                      | Version | Official Documentation                                                                                          | Notes                                           |
| ------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Jest**                        | 29.7.0  | [jestjs.io/docs](https://jestjs.io/docs/29.x/getting-started)                                                   | Unit testing framework with coverage reporting. |
| **ts-jest**                     | 29.4.1  | [kulshekhar.github.io/ts-jest](https://kulshekhar.github.io/ts-jest/)                                           | TypeScript preprocessor for Jest.               |
| **Testing Library**             | 15.0.7  | [testing-library.com/docs/react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) | React component testing utilities.              |
| **@testing-library/jest-dom**   | 6.4.5   | [github.com/testing-library/jest-dom](https://github.com/testing-library/jest-dom)                              | Custom DOM matchers for Jest.                   |
| **@testing-library/user-event** | 14.5.2  | [testing-library.com/docs/user-event](https://testing-library.com/docs/user-event/intro)                        | User interaction simulation.                    |
| **Playwright**                  | 1.56.0  | [playwright.dev](https://playwright.dev/)                                                                       | E2E testing with multi-browser support.         |

---

## Code Quality & Linting

| Technology            | Version | Official Documentation                                                             | Notes                                                 |
| --------------------- | ------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **ESLint**            | 8.57.1  | [eslint.org/docs](https://eslint.org/docs/latest/)                                 | JavaScript/TypeScript linter. Extends Airbnb config.  |
| **Prettier**          | 3.6.2   | [prettier.io/docs](https://prettier.io/docs/en/)                                   | Code formatter. Config: no semicolons, single quotes. |
| **Stylelint**         | 15.10.3 | [stylelint.io](https://stylelint.io/)                                              | CSS/SCSS linter. Enforces camelCase for CSS Modules.  |
| **typed-css-modules** | 0.8.0   | [github.com/Quramy/typed-css-modules](https://github.com/Quramy/typed-css-modules) | Generates TypeScript definitions for CSS Modules.     |

---

## Build Tools & Development

| Technology       | Version | Official Documentation                                                                   | Notes                                                  |
| ---------------- | ------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Vite**         | 4.5.3+  | [vitejs.dev](https://vitejs.dev/)                                                        | Build tool used by Remix for bundling (via overrides). |
| **ts-node**      | 10.9.1  | [typestrong.org/ts-node](https://typestrong.org/ts-node/)                                | TypeScript execution for server-side code.             |
| **concurrently** | 9.1.2   | [github.com/open-cli-tools/concurrently](https://github.com/open-cli-tools/concurrently) | Run multiple dev processes simultaneously.             |
| **chokidar**     | 3.5.3   | [github.com/paulmillr/chokidar](https://github.com/paulmillr/chokidar)                   | File watching for development workflows.               |

---

## Internationalization

| Technology        | Version | Official Documentation                                                           | Notes                              |
| ----------------- | ------- | -------------------------------------------------------------------------------- | ---------------------------------- |
| **i18next**       | 23.7.6  | [i18next.com](https://www.i18next.com/)                                          | Internationalization framework.    |
| **react-i18next** | 13.5.0  | [react.i18next.com](https://react.i18next.com/)                                  | React bindings for i18next.        |
| **remix-i18next** | 5.4.0   | [github.com/sergiodxa/remix-i18next](https://github.com/sergiodxa/remix-i18next) | i18next integration for Remix SSR. |

---

## Utility Libraries

| Technology         | Version | Official Documentation                                                               | Notes                                                      |
| ------------------ | ------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Lodash**         | 4.17.21 | [lodash.com/docs](https://lodash.com/docs/)                                          | Utility library for common operations.                     |
| **Lodash-ES**      | 4.17.21 | [lodash.com/docs](https://lodash.com/docs/)                                          | ES modules version of Lodash for tree-shaking.             |
| **clsx**           | 2.0.0   | [github.com/lukeed/clsx](https://github.com/lukeed/clsx)                             | Utility for constructing className strings conditionally.  |
| **tailwind-merge** | 1.14.0  | [github.com/dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge)       | Merge Tailwind classes intelligently, resolving conflicts. |
| **axios**          | 1.11.0  | [axios-http.com/docs](https://axios-http.com/docs/intro)                             | HTTP client for REST API calls.                            |
| **dayjs**          | 1.11.10 | [day.js.org](https://day.js.org/)                                                    | Date manipulation library.                                 |
| **pretty-bytes**   | 6.1.1   | [github.com/sindresorhus/pretty-bytes](https://github.com/sindresorhus/pretty-bytes) | Format bytes as human-readable strings.                    |
| **dedent**         | 1.5.3   | [github.com/dmnd/dedent](https://github.com/dmnd/dedent)                             | Remove indentation from template strings.                  |

---

## Animation & Interaction

| Technology                 | Version | Official Documentation                                                                          | Notes                        |
| -------------------------- | ------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| **Framer Motion**          | 10.16.4 | [framer.com/motion](https://www.framer.com/motion/)                                             | Animation library for React. |
| **react-transition-group** | 4.4.5   | [reactcommunity.org/react-transition-group](https://reactcommunity.org/react-transition-group/) | CSS transition utilities.    |
| **react-joyride**          | 2.9.3   | [docs.react-joyride.com](https://docs.react-joyride.com/)                                       | Interactive product tours.   |

---

## Data Visualization

| Technology                | Version   | Official Documentation                                                   | Notes                                                    |
| ------------------------- | --------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Neuroglancer**          | workspace | [github.com/google/neuroglancer](https://github.com/google/neuroglancer) | 3D visualization for tomograms. Custom fork in monorepo. |
| **@tanstack/react-table** | 8.10.6    | [tanstack.com/table](https://tanstack.com/table/latest)                  | Headless table library for complex data grids.           |

---

## Content Processing

| Technology               | Version | Official Documentation                                                                 | Notes                                       |
| ------------------------ | ------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| **next-mdx-remote**      | 4.4.1   | [github.com/hashicorp/next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)   | MDX support for server-rendered content.    |
| **remark-gfm**           | <4.0.0  | [github.com/remarkjs/remark-gfm](https://github.com/remarkjs/remark-gfm)               | GitHub Flavored Markdown support.           |
| **remark-sectionize**    | 2.0.0   | [github.com/jake-low/remark-sectionize](https://github.com/jake-low/remark-sectionize) | Wrap Markdown sections in `<section>` tags. |
| **@mapbox/rehype-prism** | 0.9.0   | [github.com/mapbox/rehype-prism](https://github.com/mapbox/rehype-prism)               | Syntax highlighting for code blocks.        |
| **KaTeX**                | 0.16.10 | [katex.org](https://katex.org/)                                                        | Math typesetting for formulas.              |

---

## Compression & Parsing

| Technology      | Version | Official Documentation                                                       | Notes                                       |
| --------------- | ------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| **compression** | 1.7.4   | [github.com/expressjs/compression](https://github.com/expressjs/compression) | Gzip compression middleware for Express.    |
| **pako**        | 2.1.0   | [github.com/nodeca/pako](https://github.com/nodeca/pako)                     | Zlib compression/decompression for browser. |

---

## Type Utilities

| Technology        | Version | Official Documentation                                                             | Notes                            |
| ----------------- | ------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| **utility-types** | 3.10.0  | [github.com/piotrwitek/utility-types](https://github.com/piotrwitek/utility-types) | TypeScript utility type helpers. |
| **ts-pattern**    | 5.0.5   | [github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern)         | Pattern matching for TypeScript. |

---

## Learning Resources

### Remix

- [Official Remix Tutorial](https://remix.run/docs/en/main/start/tutorial) - Build your first Remix app
- [Remix Conf Videos](https://www.youtube.com/@Remix_Run) - Conference talks and deep dives
- [Kent C. Dodds' Epic Web](https://www.epicweb.dev/) - Comprehensive Remix courses

### GraphQL

- [How to GraphQL](https://www.howtographql.com/) - Comprehensive GraphQL tutorial
- [Apollo Client Best Practices](https://www.apollographql.com/docs/react/data/operation-best-practices/) - Optimization guide
- [GraphQL Code Generator Guide](https://the-guild.dev/graphql/codegen/docs/guides/react-apollo) - Type-safe GraphQL setup

### Tailwind CSS

- [Tailwind CSS Playground](https://play.tailwindcss.com/) - Interactive experimentation
- [Tailwind UI](https://tailwindui.com/) - Component examples (paid)
- [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss) - Curated resources

### Testing

- [Testing Library Cheat Sheet](https://testing-library.com/docs/react-testing-library/cheatsheet) - Quick reference
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - E2E testing guide
- [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog/?q=testing) - Testing philosophy and patterns

---

## Community & Support

| Resource                   | URL                                                               | Description                                                 |
| -------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| **Remix Discord**          | [rmx.as/discord](https://rmx.as/discord)                          | Official Remix community chat                               |
| **Apollo GraphQL Discord** | [apollographql.com/discord](https://community.apollographql.com/) | Apollo Client support                                       |
| **Reactiflux Discord**     | [reactiflux.com](https://www.reactiflux.com/)                     | React community chat                                        |
| **Tailwind Labs Discord**  | [tailwindcss.com/discord](https://tailwindcss.com/discord)        | Tailwind CSS support                                        |
| **Stack Overflow**         | [stackoverflow.com](https://stackoverflow.com/)                   | Tag searches: `[remix]`, `[apollo-client]`, `[tailwindcss]` |

---

## Project-Specific Resources

| Resource                 | Location                                                                                             | Description            |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------- |
| **CryoET Data Portal**   | [cryoetdataportal.czscience.com](https://cryoetdataportal.czscience.com/)                            | Production application |
| **GitHub Repository**    | [github.com/chanzuckerberg/cryoet-data-portal](https://github.com/chanzuckerberg/cryoet-data-portal) | Source code and issues |
| **GraphQL API Explorer** | Configured via `API_URL_V2` env variable                                                             | GraphQL schema browser |

---

## Version Notes

All versions listed are current as of December 2024 and reflect the `package.json` dependencies in the repository. For the most up-to-date versions, consult:

- `/frontend/package.json` - Root monorepo dependencies
- `/frontend/packages/data-portal/package.json` - Data portal package dependencies

Use `pnpm outdated` to check for newer versions of dependencies.

---

## Next Steps

- [Glossary](./01-glossary.md) - Domain terminology definitions
- [Technology Stack](../01-architecture/01-technology-stack.md) - Detailed technology overview
