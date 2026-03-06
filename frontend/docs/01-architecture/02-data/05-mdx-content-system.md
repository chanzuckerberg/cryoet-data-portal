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
| `app/components/MLChallenge/MdxContent/` | Competition-specific content | `AboutTheCompetition.mdx`, `Glossary.mdx` |

---

## Server-Side Serialization

MDX content is serialized server-side using `next-mdx-remote` for optimal performance.

### Key Functions

**Location:** [`app/utils/repo.server.ts`](../../../packages/data-portal/app/utils/repo.server.ts)

```typescript
// Get MDX content from website-docs/
export async function getMdxContent(path: string): Promise<MDXRemoteSerializeResult>

// Get local file content (for feature-specific MDX)
export async function getLocalFileContent(
  path: string,
  options?: { raw?: boolean }
): Promise<string | MDXRemoteSerializeResult>

// Raw serialization function
async function serializeMdxRaw(content: string): Promise<MDXRemoteSerializeResult>
```

### Plugins Configuration

The serialization uses remark and rehype plugins:

```typescript
import remarkGfm from 'remark-gfm'
import sectionize from 'remark-sectionize'
import rehypePrism from '@mapbox/rehype-prism'

async function serializeMdxRaw(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [sectionize, remarkGfm],
      rehypePlugins: [rehypePrism],
    },
  })
}
```

| Plugin | Purpose |
|--------|---------|
| `remark-sectionize` | Organizes content into sections |
| `remark-gfm` | GitHub-flavored markdown (tables, strikethrough) |
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

**Routes using this pattern:**
- [`privacy.tsx`](../../../packages/data-portal/app/routes/privacy.tsx)
- [`terms.tsx`](../../../packages/data-portal/app/routes/terms.tsx)
- [`dmca.tsx`](../../../packages/data-portal/app/routes/dmca.tsx)
- [`data-submission-policy.tsx`](../../../packages/data-portal/app/routes/data-submission-policy.tsx)

### Hybrid MDX + Data Page

For pages combining MDX content with dynamic data:

```typescript
// app/routes/competition.tsx
import { typedjson } from 'remix-typedjson'
import { getLocalFileContent } from 'app/utils/repo.server'
import { getWinningDepositions } from 'app/graphql/getWinningDepositions.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const prefix = 'app/components/MLChallenge/MdxContent'

  // Load multiple MDX files in parallel
  const [aboutContent, glossaryContent, howToContent] = await Promise.all([
    getLocalFileContent(`${prefix}/AboutTheCompetition.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/Glossary.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/HowToParticipate.mdx`, { raw: true }),
  ])

  // Fetch dynamic data alongside MDX
  const { data } = await getWinningDepositions({ client: apolloClientV2 })

  return typedjson({
    aboutContent,
    glossaryContent,
    howToContent,
    winningDepositions: data.depositions,
  })
}
```

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
import { MdxAccordion } from './MdxAccordion'
import { MdxPageTitle } from './MdxPageTitle'
import { MdxCode, MdxClass, MdxFunction } from './MdxCode'

const components = {
  Accordion: MdxAccordion,
  PageTitle: MdxPageTitle,
  Code: MdxCode,
  Class: MdxClass,
  Function: MdxFunction,
  // HTML element overrides
  a: CustomLink,
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  // ...
}

export function MdxContent({ content }: Props) {
  return <MDXRemote {...content} components={components} />
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
getMdxContent() / getLocalFileContent()
    ↓
serializeMdxRaw() with remark/rehype plugins
    ↓
MDXRemoteSerializeResult (serialized AST)
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
├── MLChallenge.tsx
├── MdxContent/
│   ├── AboutTheCompetition.mdx
│   ├── HowToParticipate.mdx
│   └── Glossary.mdx
└── MdxComponents/
    ├── MdxPrizeTable.tsx
    ├── MdxSeeLeaderboard.tsx
    └── MdxToggleShowMore.tsx
```

Feature-specific MDX components are registered separately:

```tsx
// In MLChallenge/MainContent.tsx
const mlChallengeComponents = {
  ...baseComponents,
  PrizeTable: MdxPrizeTable,
  SeeLeaderboard: MdxSeeLeaderboard,
  ToggleShowMore: MdxToggleShowMore,
}

<MDXRemote {...content} components={mlChallengeComponents} />
```

---

## Best Practices

### Content Organization

- Place general content in `/website-docs/`
- Place feature-specific content near the feature components
- Use descriptive file names (e.g., `AboutTheCompetition.mdx` not `about.mdx`)

### Performance

- Load multiple MDX files in parallel with `Promise.all()`
- Use `{ raw: true }` when you need to process content client-side
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

---

## Next Steps

- [State Management](../03-state/01-state-management.md) - Managing content-related state
- [Component Architecture](../04-components/01-component-architecture.md) - MLChallenge component structure
- [Adding New Routes](../../03-development/01-adding-new-routes.md) - Creating new MDX pages
