# MDX Content System

This document covers the MDX (Markdown + JSX) content system used for static pages in the CryoET Data Portal, including content organization, server-side serialization, custom components, and rendering patterns.

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Content Files | [`/website-docs/`](../../../../website-docs/) | General pages (FAQ, privacy, terms) |
| Feature Content | `app/components/*/MdxContent/` | Feature-specific MDX (e.g., MLChallenge) |
| Server Utils | [`app/utils/repo.server.ts`](../../../packages/data-portal/app/utils/repo.server.ts) | MDX serialization functions |
| Renderer | [`app/components/MDX/MdxContent.tsx`](../../../packages/data-portal/app/components/MDX/MdxContent.tsx) | MDX rendering component |

---

## Content Locations

MDX files are organized by purpose:

| Location | Purpose | Examples |
|----------|---------|----------|
| `/website-docs/` | General static pages | `faq.mdx`, `privacy-policy.mdx`, `terms.mdx` |
| `app/components/MLChallenge/MdxContent/` | Competition-specific content | `AboutTheCompetition-completed.mdx`, `Glossary.mdx` |

---

## Server-Side Serialization

MDX content is serialized server-side in route loaders using `next-mdx-remote` v6 (MDX v3) for optimal performance. The serialized result is returned directly from the loader (React Router single fetch serializes it) and rendered on the client with `MDXRemote`.

> **Note:** `next-mdx-remote` v6 blocks JavaScript expressions, `import` and `export` statements in MDX by default (`blockJS`). Our content only uses Markdown and registered JSX components, so keep MDX files free of inline JS.

### Key Functions

**Location:** [`app/utils/repo.server.ts`](../../../packages/data-portal/app/utils/repo.server.ts)

```typescript
// Get MDX content from website-docs/ (fetched from GitHub raw, or read from
// the local repo when ENV=local). Returns { content: MDXRemoteSerializeResult }
export async function getMdxContent(path: string)

// Read and serialize a repo-root-relative file. Returns
// { content: MDXRemoteSerializeResult }, or the bare result when raw is true
export async function getLocalFileContent(
  path: string,
  options: { raw: boolean } = { raw: false },
)

// Read and serialize MDX that ships with the data-portal package, using a
// package-relative path. Returns MDXRemoteSerializeResult
export async function getPackageMdxContent(path: string)

// Raw serialization function
async function serializeMdxRaw(content: string)
```

Local paths are resolved from `process.cwd()`, because the server always runs from the `packages/data-portal` directory. `getLocalFileContent()` resolves relative to the repository root (`../../..`), while `getPackageMdxContent()` resolves relative to the package itself.

### Plugins Configuration

The serialization uses remark and rehype plugins:

```typescript
import rehypePrism from '@mapbox/rehype-prism'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import sectionize from 'remark-sectionize'

async function serializeMdxRaw(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [sectionize, remarkGfm],
      // @types/mapbox__rehype-prism is typed against unified v10, while MDX v3
      // uses unified v11. The plugin itself is compatible at runtime.
      rehypePlugins: [rehypePrism] as unknown as RehypePlugins,
    },
  })
}
```

| Plugin | Purpose |
|--------|---------|
| `remark-sectionize` | Organizes content into sections |
| `remark-gfm` (v4) | GitHub-flavored markdown (tables, strikethrough) |
| `@mapbox/rehype-prism` | Syntax highlighting for code blocks |

---

## Route Patterns

### Simple MDX Page

For static documentation pages:

```typescript
// app/routes/privacy.tsx
import { getMdxContent } from 'app/utils/repo.server'
import { MdxContent } from 'app/components/MDX'

export async function loader() {
  return getMdxContent('website-docs/privacy-policy.mdx')
}

export default function PrivacyPage() {
  return <MdxContent />
}
```

`MdxContent` reads the loader data through the `useMdxFile()` hook, which is a thin wrapper around `useLoaderData`:

```typescript
// app/hooks/useMdxFile.ts
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useLoaderData } from 'react-router'

export function useMdxFile() {
  return useLoaderData<{ content: MDXRemoteSerializeResult }>()
}
```

**Routes using this pattern:**
- [`privacy.tsx`](../../../packages/data-portal/app/routes/privacy.tsx)
- [`terms.tsx`](../../../packages/data-portal/app/routes/terms.tsx)
- [`dmca.tsx`](../../../packages/data-portal/app/routes/dmca.tsx)
- [`data-submission-policy.tsx`](../../../packages/data-portal/app/routes/data-submission-policy.tsx)

### Hybrid MDX + Data Page

For pages combining MDX content with dynamic data:

```typescript
// app/routes/competition.tsx
import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { getWinningDepositions } from 'app/graphql/getWinningDepositionsV2.server'
import { getPackageMdxContent } from 'app/utils/repo.server'

export async function loader() {
  const prefix = 'app/components/MLChallenge/MdxContent'

  // Fetch dynamic data alongside MDX
  const { data } = await getWinningDepositions({
    limit: 10,
    orderBy: OrderBy.Asc,
    client: apolloClientV2,
  })

  // Load multiple package-local MDX files in parallel
  const [aboutTheCompetitionCompleted, glossary, whatIsCryoET /* ... */] =
    await Promise.all([
      getPackageMdxContent(`${prefix}/AboutTheCompetition-completed.mdx`),
      getPackageMdxContent(`${prefix}/Glossary.mdx`),
      getPackageMdxContent(`${prefix}/WhatIsCryoET.mdx`),
      // ...
    ])

  // Plain object return (single fetch) - no json()/typedjson wrapper
  return {
    aboutTheCompetitionCompleted,
    glossary,
    whatIsCryoET,
    // ...
    winningDepositions: data,
  }
}
```

Components read these values with `useLoaderData`, typing each MDX entry as `MDXRemoteSerializeResult` (see `CompletedChallengeLayout.tsx`).

---

## Custom MDX Components

**Location:** [`app/components/MDX/`](../../../packages/data-portal/app/components/MDX/)

### Available Components

| Component | Purpose |
|-----------|---------|
| [`MdxContent.tsx`](../../../packages/data-portal/app/components/MDX/MdxContent.tsx) | Main renderer using `MDXRemote` |
| [`MdxAccordion.tsx`](../../../packages/data-portal/app/components/MDX/MdxAccordion.tsx) | Wraps CZI SDS Accordion |
| [`MdxPageTitle.tsx`](../../../packages/data-portal/app/components/MDX/MdxPageTitle.tsx) | Page titles with last modified dates |
| [`MdxBody.tsx`](../../../packages/data-portal/app/components/MDX/MdxBody.tsx) | Wrapper with CSS Module styling |
| [`MdxCode.tsx`](../../../packages/data-portal/app/components/MDX/MdxCode.tsx) | Syntax highlighting (MdxClass, MdxFunction) |

### Component Registration

Custom components are registered in `MdxContent.tsx`:

```tsx
import { MDXRemote } from 'next-mdx-remote'

import { useMdxFile } from 'app/hooks/useMdxFile'

import { MdxAccordion } from './MdxAccordion'
import { MdxBody } from './MdxBody'
import { MdxClass, MdxFunction, MdxOperator, MdxPunctuation, MdxString } from './MdxCode'
import { MdxEmail } from './MdxEmail'
import { MdxPageTitle } from './MdxPageTitle'

export function MdxContent() {
  const { content } = useMdxFile()

  return (
    // ...layout wrappers
    <MDXRemote
      {...content}
      components={{
        Accordion: MdxAccordion,
        Body: MdxBody,
        Class: MdxClass,
        Email: MdxEmail,
        Function: MdxFunction,
        Str: MdxString,
        Op: MdxOperator,
        Punc: MdxPunctuation,
        PageTitle: MdxPageTitle,
      }}
    />
  )
}
```

### Using Custom Components in MDX

```mdx
<PageTitle>Privacy Policy</PageTitle>

## Section Title

Regular markdown content here.

<Accordion title="Click to expand">
  Hidden content goes here.
</Accordion>

Code example with syntax highlighting:

<Code language="typescript">
const example = 'Hello World'
</Code>
```

---

## MDX Data Flow

```
MDX File (.mdx)
    ↓
Route loader
    ↓
getMdxContent() / getLocalFileContent() / getPackageMdxContent()
    ↓
serializeMdxRaw() with remark/rehype plugins
    ↓
MDXRemoteSerializeResult (compiled MDX), returned from the loader
    ↓ (single fetch serialization)
useMdxFile() / useLoaderData()
    ↓
<MDXRemote {...content} components={...} />
    ↓
Rendered HTML with custom components
```

---

## Feature-Specific MDX

For complex features like MLChallenge, MDX content lives alongside components:

```
app/components/MLChallenge/
├── CompletedMLChallenge/
├── MdxContent/
│   ├── AboutTheCompetition-completed.mdx
│   ├── ChallengeResources.mdx
│   ├── CompetitionContributors.mdx
│   ├── Glossary.mdx
│   └── WhatIsCryoET.mdx
└── MdxComponents/
    ├── MdxPrizeTable.tsx
    ├── MdxSeeLeaderboard.tsx
    ├── MdxToggleShowMore.tsx
    └── ...
```

These files are loaded with `getPackageMdxContent()`, which resolves paths relative to the data-portal package.

Feature-specific MDX components are registered separately:

```tsx
// In MLChallenge/CompletedMLChallenge/components/CompletedChallengeLayout/CompletedChallengeLayout.tsx
const COMMON_MDX_COMPONENTS = {
  a: MdxLink,
  Table: MdxTable,
  IconGrid: MdxIconGrid,
}

<MDXRemote {...glossary} components={{ ...COMMON_MDX_COMPONENTS /* , ... */ }} />
```

---

## Best Practices

### Content Organization

- Place general content in `/website-docs/`
- Place feature-specific content near the feature components
- Use descriptive file names (e.g., `AboutTheCompetition.mdx` not `about.mdx`)

### Performance

- Load multiple MDX files in parallel with `Promise.all()`
- Use `getPackageMdxContent()` (or `getLocalFileContent(path, { raw: true })`) when a loader returns several MDX documents; these return the bare `MDXRemoteSerializeResult` instead of `{ content }`
- Serialize at build time when content is truly static

### Custom Components

- Register custom components in a central location
- Override HTML elements for consistent styling
- Use TypeScript for component props

### Styling

- Use CSS Modules in `MdxBody.tsx` for MDX-specific styles
- Apply Tailwind utilities via `className` in custom components
- Maintain consistent typography with design system

---

## Troubleshooting

**Problem:** MDX component not rendering

**Solution:** Ensure the component is registered in the `components` object passed to `MDXRemote`.

**Problem:** Syntax highlighting not working

**Solution:** Verify `@mapbox/rehype-prism` is in the rehype plugins and the language is supported.

**Problem:** Custom component props not typed

**Solution:** Add TypeScript types to your custom component and ensure MDX content matches expected props.

**Problem:** MDX containing `{expressions}`, `import` or `export` doesn't render as expected

**Solution:** `next-mdx-remote` v6 blocks JavaScript in MDX by default. Move the logic into a registered component and pass plain string props instead.

---

## Next Steps

- [State Management](../03-state/01-state-management.md) - Managing content-related state
- [Component Architecture](../04-components/01-component-architecture.md) - MLChallenge component structure
- [Adding New Routes](../../03-development/01-adding-new-routes.md) - Creating new MDX pages
