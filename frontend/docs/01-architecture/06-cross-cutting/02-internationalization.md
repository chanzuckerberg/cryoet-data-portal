# Internationalization

This document describes the i18next-based internationalization system used throughout the CryoET Data Portal.

## Quick Reference

| Concept           | Implementation | Location                                                                                                 |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| Translation Hook  | `useI18n()`    | [`hooks/useI18n.ts`](../../../packages/data-portal/app/hooks/useI18n.ts)                                 |
| Translation Files | JSON format    | [`public/locales/en/translation.json`](../../../packages/data-portal/public/locales/en/translation.json) |
| Configuration     | remix-i18next  | [`i18next.server.ts`](../../../packages/data-portal/app/i18next.server.ts)                               |

---

## Architecture Overview

The i18n system uses i18next integrated with React Router (formerly Remix) via `remix-i18next`:

```
Translation Files (JSON)
         ↓
   i18next Server
         ↓
   Route Loader
         ↓
   useI18n() Hook
         ↓
   Component UI
```

### Key Technologies

- **i18next** (v24) - Core i18n framework
- **react-i18next** - React bindings
- **remix-i18next** (v7) - Server-side integration for React Router framework mode (`remix-i18next/server`, `remix-i18next/react`, `remix-i18next/client`)
- **i18next-browser-languagedetector** - Automatic language detection

---

## Basic Usage

### useI18n Hook

```typescript
import { useI18n } from 'app/hooks/useI18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('datasets')}</h1>
      <p>{t('datasetsDescription')}</p>
    </div>
  )
}
```

**Location:** [`hooks/useI18n.ts`](../../../packages/data-portal/app/hooks/useI18n.ts)

### Hook Implementation

```typescript
/**
 * Wrapper over `useTranslation` hook that uses `translation` namespace by
 * default so that the `t` function is typed with all of the i18n keys.
 */
export function useI18n(options?: UseTranslationOptions<undefined>) {
  return useTranslation('translation', options)
}

export type I18nTFunction = ReturnType<typeof useI18n>['t']
```

**Benefits:**

- Type-safe translation keys
- Auto-completion in IDE
- Compile-time key validation
- Consistent namespace usage

---

## Translation File Structure

### Hierarchical Keys

Translations use hierarchical keys with dot notation:

```json
{
  "datasets": "Datasets",
  "datasetsDescription": "Browse and explore cryoET datasets",

  "about": "About",
  "aboutAndReport": "About & Report",
  "aboutTheCompetition": "About the Competition",

  "annotation": "Annotation",
  "annotationAuthor": "Annotation Author",
  "annotationAuthors": "Annotation Authors",
  "annotationConfidence": "Annotation Confidence",
  "annotationDetails": "Annotation Details",
  "annotationId": "Annotation ID",
  "annotationMetadata": "Annotation Metadata",

  "author": "Author",
  "authorName": "Author Name",
  "authorOrcid": "Author ORCID ID",
  "authors": "Authors"
}
```

**Location:** [`public/locales/en/translation.json`](../../../packages/data-portal/public/locales/en/translation.json)

### Naming Conventions

| Pattern       | Example                 | Usage                       |
| ------------- | ----------------------- | --------------------------- |
| Singular noun | `"dataset"`             | Single item labels          |
| Plural noun   | `"datasets"`            | Multiple items, page titles |
| Action verb   | `"download"`, `"apply"` | Button labels               |
| Description   | `"datasetsDescription"` | Longer explanatory text     |
| Plural suffix | `"authorsMaybePlural"`  | Context-dependent plurals   |

---

## Translation Patterns

### Simple Text

```typescript
const { t } = useI18n()

// Basic translation
<h1>{t('datasets')}</h1>

// Translation with fallback
<span>{t('label') || 'Default Label'}</span>
```

### Interpolation

Use placeholders for dynamic values:

```json
{
  "datasetCount": "Showing {{count}} datasets",
  "lastUpdated": "Last updated: {{date}}",
  "greeting": "Hello, {{name}}!"
}
```

```typescript
const { t } = useI18n()

<p>{t('datasetCount', { count: 42 })}</p>
// Output: "Showing 42 datasets"

<p>{t('lastUpdated', { date: '2024-12-10' })}</p>
// Output: "Last updated: 2024-12-10"
```

### Pluralization

i18next handles plurals automatically:

```json
{
  "acrossDatasets_one": "Across {{count}} Dataset",
  "acrossDatasets_other": "Across {{count}} Datasets"
}
```

```typescript
const { t } = useI18n()

<span>{t('acrossDatasets', { count: 1 })}</span>
// Output: "Across 1 Dataset"

<span>{t('acrossDatasets', { count: 5 })}</span>
// Output: "Across 5 Datasets"
```

**Plural suffixes:**

- `_one` - Singular form
- `_other` - Plural form (default)
- `_zero` - Zero items (optional)

### Object Replacement

Use `replace` option for complex interpolations:

```json
{
  "onlyDisplayingDatasetsWithOrganismAndDeposition": "Only displaying datasets with organism <bold>{{organismName}}</bold> and deposition <bold>{{depositionId}}: {{depositionName}}</bold>"
}
```

```typescript
const { t } = useI18n()

<p>{t('onlyDisplayingDatasetsWithOrganismAndDeposition', {
  replace: {
    organismName: 'Homo sapiens',
    depositionId: 12345,
    depositionName: 'Test Deposition',
  },
})}</p>
```

### HTML in Translations

For rich text content with formatting:

```json
{
  "annotationsMayRequireTransformation": "Annotations may require transformation if the desired tomogram has a different Alignment ID. <url to='https://docs.example.com'>Learn about annotation transformation.</url>"
}
```

```typescript
<Trans
  i18nKey="annotationsMayRequireTransformation"
  components={{
    url: <Link to="https://docs.example.com" target="_blank" />,
  }}
/>
```

---

## Special Cases

### Formatted Text

```json
{
  "boldedText": "Bolded text",
  "alignmentIdStandardTooltip": "<semibold>Portal Standard:</semibold> Standardized alignment used to reconstruct a tomogram ensuring a consistent format and coordinate space across the Portal."
}
```

```typescript
<Trans
  i18nKey="alignmentIdStandardTooltip"
  components={{
    semibold: <span className="font-semibold" />,
  }}
/>
```

### Links in Text

```json
{
  "apiDocLink": "https://chanzuckerberg.github.io/cryoet-data-portal/stable/python-api.html",
  "citePortalLink": "https://chanzuckerberg.github.io/cryoet-data-portal/stable/#citing-the-cryoet-data-portal",
  "awsCliLink": "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
}
```

```typescript
const { t } = useI18n()

<Link to={t('apiDocLink')} target="_blank">
  {t('viewApiDocs')}
</Link>
```

### Contextual Translations

Different translations based on context:

```json
{
  "all": "All",
  "allDatasets": "All Datasets",
  "allDepositions": "All Depositions"
}
```

```typescript
// Generic
<span>{t('all')}</span>

// Specific context
<h1>{t('allDatasets')}</h1>
```

---

## Formatting Utilities

### Date Formatting

```typescript
const { t, i18n } = useI18n()

const formattedDate = new Intl.DateTimeFormat(i18n.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())
```

### Number Formatting

```typescript
const { t, i18n } = useI18n()

// Format with locale-specific separators
const formattedNumber = new Intl.NumberFormat(i18n.language).format(1234567)
// Output (en-US): "1,234,567"

// Format with method
const count = 1234567
<span>{count.toLocaleString(i18n.language)}</span>
```

### Currency Formatting

```typescript
const formattedPrice = new Intl.NumberFormat(i18n.language, {
  style: 'currency',
  currency: 'USD',
}).format(29.99)
// Output: "$29.99"
```

---

## Type Safety

### Translation Key Types

The `useI18n()` hook provides type-safe translation keys:

```typescript
// ✅ Valid key - auto-completion works
t('datasets')

// ❌ Invalid key - TypeScript error
t('nonExistentKey')

// Type definition (app/types/i18n.ts)
export type I18nKeys = ParseKeys<I18nNamespace>
```

Key typing comes from the `CustomTypeOptions` module augmentation in [`types/i18n.ts`](../../../packages/data-portal/app/types/i18n.ts), which passes the type of `public/locales/en/translation.json` to i18next. With `moduleResolution: "bundler"` in `tsconfig.json` this augmentation is applied, so `t()` only accepts known keys and unknown keys fail `pnpm type-check`.

### Function Type

```typescript
import { I18nTFunction } from 'app/hooks/useI18n'

function MyComponent({ t }: { t: I18nTFunction }) {
  return <h1>{t('datasets')}</h1>
}
```

---

## Server-Side Integration

### Route Loader

```typescript
import { LoaderFunctionArgs } from 'react-router'

import { i18next } from 'app/i18next.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request)

  return {
    title: t('datasets'),
    description: t('datasetsDescription'),
  }
}
```

The root loader in [`root.tsx`](../../../packages/data-portal/app/root.tsx) uses `i18next.getLocale(request)` to detect the locale, and the root component calls `useChangeLanguage(locale)` from `remix-i18next/react` to keep the client i18n instance in sync.

### Configuration

```typescript
// i18next.server.ts
import { resolve } from 'node:path'

import Backend from 'i18next-fs-backend'
import { RemixI18Next } from 'remix-i18next/server'

import { i18n } from './i18next'

// Resolved from the working directory so it works for both `pnpm dev`
// and the production server started from the package root
export const LOCALES_PATH = resolve(
  process.cwd(),
  'public/locales/{{lng}}/{{ns}}.json',
)

export const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: LOCALES_PATH,
    },
  },
  plugins: [Backend],
})
```

The shared options (`supportedLngs: ['en']`, `fallbackLng: 'en'`, interpolation and React settings) live in [`i18next.ts`](../../../packages/data-portal/app/i18next.ts). On the client, [`entry.client.tsx`](../../../packages/data-portal/app/entry.client.tsx) initializes i18next with `getInitialNamespaces()` from `remix-i18next/client` and loads translations over HTTP from `/locales/{{lng}}/{{ns}}.json` before hydrating `<HydratedRouter />`. [`entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx) creates a per-request instance using `i18next.getRouteNamespaces(...)`.

**Location:** [`i18next.server.ts`](../../../packages/data-portal/app/i18next.server.ts)

---

## Adding New Translations

### Step 1: Add to JSON File

```json
{
  "myNewKey": "My New Translation",
  "myNewKeyWithParams": "Hello {{name}}, you have {{count}} items"
}
```

### Step 2: Use in Component

```typescript
const { t } = useI18n()

<div>
  <p>{t('myNewKey')}</p>
  <p>{t('myNewKeyWithParams', { name: 'John', count: 5 })}</p>
</div>
```

### Step 3: Verify Type Safety

TypeScript should auto-suggest the new key. If not, restart TypeScript server.

---

## Translation Organization

### Grouping Strategies

#### By Feature

```json
{
  "dataset": "Dataset",
  "datasetId": "Dataset ID",
  "datasetTitle": "Dataset Title",
  "datasetDescription": "Dataset Description",

  "annotation": "Annotation",
  "annotationId": "Annotation ID",
  "annotationName": "Annotation Name"
}
```

#### By Component

```json
{
  "browseData": "Browse Data",
  "browseDataDescription": "Explore datasets and depositions",

  "datasetTable": "Dataset Table",
  "datasetTableNoResults": "No datasets found"
}
```

#### By Action

```json
{
  "download": "Download",
  "downloadDataset": "Download Dataset",
  "downloadAll": "Download All",
  "downloadOptions": "Download Options",

  "apply": "Apply",
  "applyFilters": "Apply Filters"
}
```

---

## Best Practices

### Do's

✅ **Use semantic keys**

```json
{
  "datasetCount": "{{count}} datasets",
  "noResultsFound": "No results found"
}
```

✅ **Keep translations close to UI text**

```typescript
// Good - clear intent
{
  t('downloadButton')
}

// Avoid - vague
{
  t('action1')
}
```

✅ **Use interpolation for dynamic content**

```typescript
// Good
t('showing', { count: 10, total: 100 })
// Avoid
`Showing ${count} of ${total}`
```

✅ **Group related translations**

```json
{
  "author": "Author",
  "authorName": "Author Name",
  "authorOrcid": "Author ORCID ID",
  "authors": "Authors"
}
```

### Don'ts

❌ **Don't hardcode text**

```typescript
// Avoid
<button>Download</button>

// Use
<button>{t('download')}</button>
```

❌ **Don't concatenate translations**

```typescript
// Avoid
t('showing') + ' ' + count + ' ' + t('results')

// Use
t('showingResults', { count })
```

❌ **Don't duplicate translations**

```json
// Avoid
{
  "downloadButton": "Download",
  "downloadLink": "Download",
  "downloadAction": "Download"
}

// Use
{
  "download": "Download"
}
```

❌ **Don't include HTML in JSON (use Trans component)**

```json
// Avoid
{
  "warning": "<strong>Warning:</strong> This action cannot be undone"
}

// Use Trans instead
{
  "warning": "Warning: This action cannot be undone"
}
```

---

## Testing Translations

### Mock Translations

[`setupTests.ts`](../../../packages/data-portal/setupTests.ts) already mocks `react-i18next` globally so `t()` returns the key. A per-test mock looks like this:

```typescript
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

describe('MyComponent', () => {
  it('renders translated text', () => {
    render(<MyComponent />)
    expect(screen.getByText('datasets')).toBeInTheDocument()
  })
})
```

### Test Multiple Languages

```typescript
it('renders in different languages', () => {
  const { rerender } = render(
    <I18nextProvider i18n={i18nextInstance}>
      <MyComponent />
    </I18nextProvider>
  )

  expect(screen.getByText('Datasets')).toBeInTheDocument()

  i18nextInstance.changeLanguage('es')
  rerender(
    <I18nextProvider i18n={i18nextInstance}>
      <MyComponent />
    </I18nextProvider>
  )

  expect(screen.getByText('Conjuntos de datos')).toBeInTheDocument()
})
```

---

## Future: Multi-Language Support

### Current State

The portal currently supports English only:

```typescript
// app/i18next.ts
supportedLngs: ['en'],
fallbackLng: 'en',
```

### Adding New Languages

To add a new language (e.g., Spanish):

1. Create translation file: `public/locales/es/translation.json`
2. Update the shared i18next config in `app/i18next.ts` (used by `i18next.server.ts` for detection):

```typescript
supportedLngs: ['en', 'es'],
fallbackLng: 'en',
```

3. Add language selector UI:

```typescript
function LanguageSelector() {
  const { i18n } = useI18n()

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  )
}
```

---

## Next Steps

- [Component Architecture](../04-components/01-component-architecture.md) - Using i18n in components
- [Hooks Guide](./03-hooks-guide.md) - More about useI18n
- [Technology Stack](../00-foundation/01-technology-stack.md) - i18next setup
