# External Resources

This document provides links to external documentation for the technologies, frameworks, and tools used in the CryoET Data Portal frontend. Use these resources to deepen your understanding of the stack.

> **Note:** For current versions, see `package.json`. Node.js version is specified in `.nvmrc`.

---

## Core Framework & Runtime

| Technology     | Official Documentation                                          | Notes                                                                                                    |
| -------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Node.js**    | [nodejs.org/docs](https://nodejs.org/docs/latest-v20.x/api/)    | LTS runtime environment. Version specified in `.nvmrc`.                                                  |
| **pnpm**       | [pnpm.io](https://pnpm.io/)                                     | Fast, disk-efficient package manager. Version specified in `package.json` engines field.                 |
| **Remix**      | [remix.run/docs](https://remix.run/docs/)                       | Full-stack React framework with SSR. See also [Remix Fundamentals](../01-architecture/01-routing/01-remix-fundamentals.md). |
| **React**      | [react.dev](https://react.dev/)                                 | UI library.                                                                                              |
| **TypeScript** | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Strict mode enabled. See `tsconfig.json` for configuration.                                              |
| **Express**    | [expressjs.com](https://expressjs.com/)                         | HTTP server for Remix SSR.                                                                               |

---

## GraphQL & Data Fetching

| Technology                       | Official Documentation                                                                                         | Notes                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **GraphQL**                      | [graphql.org/learn](https://graphql.org/learn/)                                                                | Query language for API.                                                                                   |
| **Apollo Client**                | [apollographql.com/docs/react](https://www.apollographql.com/docs/react/)                                      | GraphQL client with SSR support. See [GraphQL Integration](../01-architecture/02-data/01-graphql-integration.md). |
| **GraphQL Code Generator**       | [graphql-code-generator.com](https://the-guild.dev/graphql/codegen)                                            | Generates TypeScript types from schema. Config in `codegen.ts`.                                           |
| **@graphql-typed-document-node** | [github.com/dotansimha/graphql-typed-document-node](https://github.com/dotansimha/graphql-typed-document-node) | Typed GraphQL document nodes for type safety.                                                             |
| **TanStack Query**               | [tanstack.com/query](https://tanstack.com/query/latest)                                                        | Server state management for REST endpoints (non-GraphQL data).                                            |

---

## State Management

| Technology | Official Documentation          | Notes                                                                                       |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Jotai**  | [jotai.org](https://jotai.org/) | Atomic state management. See [State Management](../01-architecture/03-state/01-state-management.md). |

---

## Styling

| Technology              | Official Documentation                                                                       | Notes                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Tailwind CSS**        | [tailwindcss.com/docs](https://tailwindcss.com/docs)                                         | Utility-first CSS framework. Primary styling approach.                   |
| **Material-UI (MUI)**   | [mui.com/material-ui](https://mui.com/material-ui/)                                          | React component library. Use components but prefer Tailwind for styling. |
| **@mui/icons-material** | [mui.com/material-ui/material-icons](https://mui.com/material-ui/material-icons/)            | Icon library.                                                            |
| **CZI SDS**             | [github.com/chanzuckerberg/sci-components](https://github.com/chanzuckerberg/sci-components) | CZI Science Design System. Design tokens integrated via Tailwind.        |
| **Emotion**             | [emotion.sh/docs](https://emotion.sh/docs/introduction)                                      | CSS-in-JS library. Used for MUI integration and SSR style extraction.    |
| **PostCSS**             | [postcss.org](https://postcss.org/)                                                          | CSS transformation pipeline.                                             |
| **Autoprefixer**        | [github.com/postcss/autoprefixer](https://github.com/postcss/autoprefixer)                   | Adds vendor prefixes automatically.                                      |

---

## Testing

| Technology                      | Official Documentation                                                                                          | Notes                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Jest**                        | [jestjs.io/docs](https://jestjs.io/docs/getting-started)                                                        | Unit testing framework with coverage reporting. |
| **ts-jest**                     | [kulshekhar.github.io/ts-jest](https://kulshekhar.github.io/ts-jest/)                                           | TypeScript preprocessor for Jest.               |
| **Testing Library**             | [testing-library.com/docs/react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) | React component testing utilities.              |
| **@testing-library/jest-dom**   | [github.com/testing-library/jest-dom](https://github.com/testing-library/jest-dom)                              | Custom DOM matchers for Jest.                   |
| **@testing-library/user-event** | [testing-library.com/docs/user-event](https://testing-library.com/docs/user-event/intro)                        | User interaction simulation.                    |
| **Playwright**                  | [playwright.dev](https://playwright.dev/)                                                                       | E2E testing with multi-browser support.         |

---

## Code Quality & Linting

| Technology            | Official Documentation                                                             | Notes                                                 |
| --------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **ESLint**            | [eslint.org/docs](https://eslint.org/docs/latest/)                                 | JavaScript/TypeScript linter. Extends Airbnb config.  |
| **Prettier**          | [prettier.io/docs](https://prettier.io/docs/en/)                                   | Code formatter. Config: no semicolons, single quotes. |
| **Stylelint**         | [stylelint.io](https://stylelint.io/)                                              | CSS/SCSS linter. Enforces camelCase for CSS Modules.  |
| **typed-css-modules** | [github.com/Quramy/typed-css-modules](https://github.com/Quramy/typed-css-modules) | Generates TypeScript definitions for CSS Modules.     |

---

## Build Tools & Development

| Technology       | Official Documentation                                                                   | Notes                                                  |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Vite**         | [vitejs.dev](https://vitejs.dev/)                                                        | Build tool used by Remix for bundling (via overrides). |
| **ts-node**      | [typestrong.org/ts-node](https://typestrong.org/ts-node/)                                | TypeScript execution for server-side code.             |
| **concurrently** | [github.com/open-cli-tools/concurrently](https://github.com/open-cli-tools/concurrently) | Run multiple dev processes simultaneously.             |
| **chokidar**     | [github.com/paulmillr/chokidar](https://github.com/paulmillr/chokidar)                   | File watching for development workflows.               |

---

## Internationalization

| Technology        | Official Documentation                                                           | Notes                              |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------------- |
| **i18next**       | [i18next.com](https://www.i18next.com/)                                          | Internationalization framework.    |
| **react-i18next** | [react.i18next.com](https://react.i18next.com/)                                  | React bindings for i18next.        |
| **remix-i18next** | [github.com/sergiodxa/remix-i18next](https://github.com/sergiodxa/remix-i18next) | i18next integration for Remix SSR. |

---

## Utility Libraries

| Technology         | Official Documentation                                                               | Notes                                                      |
| ------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Lodash**         | [lodash.com/docs](https://lodash.com/docs/)                                          | Utility library for common operations.                     |
| **Lodash-ES**      | [lodash.com/docs](https://lodash.com/docs/)                                          | ES modules version of Lodash for tree-shaking.             |
| **clsx**           | [github.com/lukeed/clsx](https://github.com/lukeed/clsx)                             | Utility for constructing className strings conditionally.  |
| **tailwind-merge** | [github.com/dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge)       | Merge Tailwind classes intelligently, resolving conflicts. |
| **axios**          | [axios-http.com/docs](https://axios-http.com/docs/intro)                             | HTTP client for REST API calls.                            |
| **dayjs**          | [day.js.org](https://day.js.org/)                                                    | Date manipulation library.                                 |
| **pretty-bytes**   | [github.com/sindresorhus/pretty-bytes](https://github.com/sindresorhus/pretty-bytes) | Format bytes as human-readable strings.                    |
| **dedent**         | [github.com/dmnd/dedent](https://github.com/dmnd/dedent)                             | Remove indentation from template strings.                  |

---

## Animation & Interaction

| Technology                 | Official Documentation                                                                          | Notes                        |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| **Framer Motion**          | [framer.com/motion](https://www.framer.com/motion/)                                             | Animation library for React. |
| **react-transition-group** | [reactcommunity.org/react-transition-group](https://reactcommunity.org/react-transition-group/) | CSS transition utilities.    |
| **react-joyride**          | [docs.react-joyride.com](https://docs.react-joyride.com/)                                       | Interactive product tours.   |

---

## Data Visualization

| Technology                | Official Documentation                                                   | Notes                                                    |
| ------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Neuroglancer**          | [github.com/google/neuroglancer](https://github.com/google/neuroglancer) | 3D visualization for tomograms. Custom fork in monorepo. |
| **@tanstack/react-table** | [tanstack.com/table](https://tanstack.com/table/latest)                  | Headless table library for complex data grids.           |

---

## Content Processing

| Technology               | Official Documentation                                                                 | Notes                                       |
| ------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| **next-mdx-remote**      | [github.com/hashicorp/next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)   | MDX support for server-rendered content.    |
| **remark-gfm**           | [github.com/remarkjs/remark-gfm](https://github.com/remarkjs/remark-gfm)               | GitHub Flavored Markdown support.           |
| **remark-sectionize**    | [github.com/jake-low/remark-sectionize](https://github.com/jake-low/remark-sectionize) | Wrap Markdown sections in `<section>` tags. |
| **@mapbox/rehype-prism** | [github.com/mapbox/rehype-prism](https://github.com/mapbox/rehype-prism)               | Syntax highlighting for code blocks.        |
| **KaTeX**                | [katex.org](https://katex.org/)                                                        | Math typesetting for formulas.              |

---

## Compression & Parsing

| Technology      | Official Documentation                                                       | Notes                                       |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| **compression** | [github.com/expressjs/compression](https://github.com/expressjs/compression) | Gzip compression middleware for Express.    |
| **pako**        | [github.com/nodeca/pako](https://github.com/nodeca/pako)                     | Zlib compression/decompression for browser. |

---

## Type Utilities

| Technology        | Official Documentation                                                             | Notes                            |
| ----------------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| **utility-types** | [github.com/piotrwitek/utility-types](https://github.com/piotrwitek/utility-types) | TypeScript utility type helpers. |
| **ts-pattern**    | [github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern)         | Pattern matching for TypeScript. |

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

## Next Steps

- [Glossary](./01-glossary.md) - Domain terminology definitions
- [Technology Stack](../01-architecture/00-foundation/01-technology-stack.md) - Detailed technology overview
