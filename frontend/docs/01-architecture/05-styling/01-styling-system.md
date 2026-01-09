# Styling System

This document covers the styling architecture of the CryoET Data Portal frontend, including the integration of the CZI Science Design System (SDS), Tailwind CSS, CSS Modules, and Material-UI, along with guidance on when to use each approach.


## Quick Reference

| Technology              | Purpose                    | When to Use                                                |
| ----------------------- | -------------------------- | ---------------------------------------------------------- |
| **CZI SDS Components**  | Pre-built design system    | **First choice** - buttons, inputs, icons, menus, dialogs  |
| **Material-UI**         | Complex components         | **Second choice** - when SDS doesn't provide equivalent    |
| **Tailwind CSS**        | Utility-first styling      | Customization, layout (flex, grid), custom components      |
| **CSS Modules**         | Component-scoped styles    | Complex styles not easy to do with Tailwind                |
| **Emotion**             | CSS-in-JS                  | SSR style extraction (used internally by MUI)              |

---

## Styling Architecture

The application uses a **layered styling approach** with clear precedence:

```
┌─────────────────────────────────────────┐
│ 1. SDS Components (Primary)             │  ← Start here for UI components
├─────────────────────────────────────────┤
│ 2. Material-UI (Secondary)              │  ← When SDS lacks the component
├─────────────────────────────────────────┤
│ 3. Tailwind CSS (Customization)         │  ← Layout, custom components
├─────────────────────────────────────────┤
│ 4. CSS Modules (Complex styles)         │  ← When Tailwind can't handle it
└─────────────────────────────────────────┘
```

**Philosophy:** Always use SDS components first. If SDS doesn't have what you need, use MUI. Use Tailwind for customization and custom components. Use CSS Modules for complex styles that Tailwind can't easily handle.

---

## Tailwind CSS (Layout & Utilities)

Tailwind provides **layout utilities and SDS design tokens**. Always prefer SDS Tailwind tokens (`sds-*`) for colors, typography, and spacing.

### Configuration

From [`tailwind.config.ts`](../../../packages/data-portal/tailwind.config.ts):

```typescript
import sds from '@czi-sds/components/dist/tailwind.json'
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      ...sds, // Imports CZI Design System tokens

      screens: {
        'screen-360': '360px',
        'screen-512': '512px',
        'screen-667': '667px',
        'screen-1024': '1024px',
        'screen-1345': '1345px',
        'screen-2040': '2040px',
      },

      maxWidth: {
        content: '1600px',
        'content-small': '800px',
      },

      lineHeight: {
        'sds-header-xxl': '34px',
        'sds-header-xl': '30px',
        'sds-body-l': '28px',
        // ... more SDS overrides
      },

      boxShadow: {
        card: '0px 2px 12px 0px #0000004D',
      },
    },
  },
  plugins: [backgroundImageSrcPlugin],
} satisfies Config
```

### Custom Breakpoints

The app defines custom breakpoints for precise responsive design:

| Breakpoint    | Width  | Common Use    |
| ------------- | ------ | ------------- |
| `screen-360`  | 360px  | Small mobile  |
| `screen-512`  | 512px  | Mobile        |
| `screen-667`  | 667px  | Large mobile  |
| `screen-1024` | 1024px | Tablet        |
| `screen-1345` | 1345px | Desktop       |
| `screen-2040` | 2040px | Large desktop |

**Usage:**

```tsx
<div className="grid grid-cols-1 screen-1024:grid-cols-2 screen-1345:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

### CZI SDS Integration

Design tokens from `@czi-sds/components` are imported into Tailwind:

```typescript
import sds from '@czi-sds/components/dist/tailwind.json'

export default {
  theme: {
    extend: {
      ...sds, // Colors, fonts, spacing from SDS
    },
  },
}
```

**Available SDS utilities:**

```tsx
{/* Colors */}
<div className="bg-sds-color-primitive-blue-400" />
<p className="text-light-sds-color-semantic-base-text-primary" />

{/* Typography */}
<h1 className="text-sds-header-xl leading-sds-header-xl" />
<p className="text-sds-body-m leading-sds-body-m" />

{/* Spacing */}
<div className="p-sds-l mb-sds-m" />
```

### Common Patterns

**Layout:**

```tsx
{
  /* Flexbox */
}
;<div className="flex items-center justify-between gap-4">
  <span>Label</span>
  <button>Action</button>
</div>

{
  /* Grid */
}
;<div className="grid grid-cols-3 gap-sds-m">
  <Card />
  <Card />
  <Card />
</div>

{
  /* Responsive layout */
}
;<div className="flex flex-col screen-1024:flex-row">
  <Sidebar />
  <Main />
</div>
```

**Spacing:**

```tsx
{
  /* Padding and margins */
}
;<div className="p-sds-xl mb-sds-l">
  <h2 className="mb-sds-m">Title</h2>
  <p className="mt-sds-s">Description</p>
</div>
```

**Typography:**

```tsx
{
  /* Headers */
}
;<h1 className="text-sds-header-xxl leading-sds-header-xxl font-semibold">
  Page Title
</h1>

{
  /* Body text */
}
;<p className="text-sds-body-m leading-sds-body-m text-sds-color-primitive-gray-600">
  Body text content
</p>

{
  /* Caps (small labels) */
}
;<span className="text-sds-caps-xxxs leading-sds-caps-xxxs uppercase tracking-wide">
  Label
</span>
```

**Colors:**

```tsx
{/* Background */}
<div className="bg-sds-color-primitive-blue-100">

{/* Text */}
<p className="text-sds-color-primitive-gray-600">

{/* Borders */}
<div className="border border-sds-color-primitive-gray-300">
```

**Responsive Design:**

```tsx
{/* Mobile-first approach */}
<div className="text-sm screen-667:text-base screen-1024:text-lg">
  Responsive text
</div>

{/* Hidden/shown at breakpoints */}
<nav className="hidden screen-1024:block">Desktop Nav</nav>
<nav className="block screen-1024:hidden">Mobile Nav</nav>
```

### ESLint Enforcement

Tailwind is enforced as the preferred styling approach:

From [`typescript.cjs`](../../../packages/eslint-config/typescript.cjs):

```javascript
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['@mui/*'],
    importNames: ['styled'],
    message: 'Prefer tailwind over MUI styled components',
  }],
}]
```

**This rule prevents:**

```typescript
// ❌ Forbidden
import { styled } from '@mui/material'
const StyledDiv = styled('div')({ padding: 16 })

// ✅ Use Tailwind instead
<div className="p-4">
```

---

## CSS Modules (Component-Specific Styles)

CSS Modules provide **component-scoped styles** for complex styling that's difficult with Tailwind.

### When to Use CSS Modules

Use CSS Modules for:

- Complex pseudo-selectors (`:hover`, `:focus-within`)
- CSS animations and transitions
- Deeply nested selectors
- Targeting global classes (e.g., MUI classes)
- Styles that need CSS features not in Tailwind

### File Structure

CSS Modules use `.module.css` or `.module.scss` extensions:

```
app/components/Filters/
├── Filters.tsx
├── Filters.module.css    # Scoped styles
└── Filters.test.tsx
```

### Example CSS Module

From [`Filters.module.css`](../../../packages/data-portal/app/components/Filters/Filters.module.css):

```css
/* stylelint-disable selector-class-pattern */

.boolean {
  /* Target global MUI classes */
  :global(.MuiFormControlLabel-root) {
    @apply !m-0 !items-center;
  }

  :global(.MuiTypography-root) span span {
    @apply !text-sds-body-s-400-wide !leading-sds-body-s font-semibold;
    @apply !text-light-sds-color-primitive-gray-600;
  }

  &:hover {
    :global(.MuiTypography-root) span span {
      @apply !text-black;
    }
  }

  svg {
    @apply fill-white;
  }
}

.select {
  :global(.MuiButtonBase-root) {
    @apply w-max;

    /* Custom CSS when Tailwind isn't enough */
    padding: 5px theme('padding.sds-s');

    ~ div {
      @apply pl-sds-s pt-sds-xxxs mt-0;

      &:empty {
        @apply hidden;
      }
    }
  }
}
```

**Key patterns:**

1. Use `:global()` to target MUI class names
2. Combine with `@apply` for Tailwind utilities
3. Use `theme()` to access Tailwind config values
4. Nest selectors for specificity

### Usage in Components

```typescript
import styles from './Filters.module.css'

function BooleanFilter() {
  return (
    <div className={styles.boolean}>
      <FormControlLabel control={<Checkbox />} label="Ground Truth" />
    </div>
  )
}
```

### Type Generation

CSS Modules have auto-generated TypeScript definitions:

```bash
# Generate types once
pnpm data-portal build:tcm

# Watch mode (auto-regenerate)
pnpm data-portal dev:tcm
```

This creates `Filters.module.css.d.ts`:

```typescript
declare const styles: {
  readonly boolean: string
  readonly booleanWrapped: string
  readonly select: string
  readonly popper: string
  readonly inputText: string
}
export default styles
```

**Benefits:**

- Autocomplete for class names
- TypeScript errors for typos
- Refactoring safety

### Combining Tailwind and CSS Modules

You can mix both approaches:

```tsx
import styles from './Card.module.css'

function Card() {
  return (
    <div className={`${styles.card} p-sds-l rounded-lg shadow-card`}>
      {/* CSS Module for animation, Tailwind for layout */}
    </div>
  )
}
```

```css
/* Card.module.css */
.card {
  /* Complex animation not in Tailwind */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
  }
}
```

---

## Material-UI (Fallback)

Material-UI provides accessible, pre-built React components. **Use MUI only when SDS doesn't provide an equivalent component.**

### When to Use Material-UI

**Always check SDS first!** SDS provides: Button, Icon, InputText, InputCheckbox, InputRadio, InputSearch, Menu, DropdownMenu, Dialog, Callout, Banner, Accordion, Pagination, Table components.

Use MUI only for:

- Complex UI patterns **not available in SDS**
- Components where MUI has better accessibility support than SDS
- Icons not available in SDS (`@mui/icons-material`)

**Don't use MUI for:**

- Components that SDS provides (buttons, inputs, menus, dialogs, icons)
- Layout (use Tailwind grid/flex)
- Simple styling (use SDS Tailwind tokens)
- Custom styled components (use Tailwind or CSS Modules)

### Styling MUI Components

**✅ Preferred: Style with SDS Tailwind tokens**

When you must use MUI, always style with SDS tokens:

```tsx
import { TextField } from '@mui/material'

function Form() {
  return (
    <div className="flex flex-col gap-sds-m">
      <TextField
        label="Name"
        className="w-full"
        InputProps={{
          className: 'text-sds-body-m-400-wide',
        }}
      />
      {/* Consider: Could this use SDS InputText instead? */}
    </div>
  )
}
```

**❌ Avoid: MUI styled components**

```typescript
// Forbidden by ESLint
import { styled } from '@mui/material'
const StyledButton = styled(Button)({
  backgroundColor: 'blue',
})
```

**❌ Avoid: Using MUI when SDS has the component**

```tsx
// ❌ Don't use MUI Button when SDS Button exists
import { Button } from '@mui/material'

// ✅ Use SDS Button instead
import { Button } from '@czi-sds/components'
```

### Common MUI Components

**Modals:**

```tsx
import { Modal, Box } from '@mui/material'

function DownloadModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-sds-xl shadow-card">
        <h2 className="text-sds-header-l mb-sds-m">Download Options</h2>
        {/* Content */}
      </Box>
    </Modal>
  )
}
```

**Form Controls:**

```tsx
import { TextField, Checkbox, FormControlLabel } from '@mui/material'

function FilterPanel() {
  return (
    <div className="flex flex-col gap-sds-m">
      <TextField label="Search" variant="outlined" className="w-full" />
      <FormControlLabel
        control={<Checkbox />}
        label="Ground Truth Only"
        className="text-sds-body-s"
      />
    </div>
  )
}
```

**Icons:**

```tsx
import { Download, FilterList } from '@mui/icons-material'

function Actions() {
  return (
    <div className="flex gap-2">
      <button className="p-2 rounded hover:bg-gray-100">
        <Download className="text-gray-600" />
      </button>
      <button className="p-2 rounded hover:bg-gray-100">
        <FilterList className="text-gray-600" />
      </button>
    </div>
  )
}
```

### Customizing MUI Theme

MUI theme is configured via Emotion for SSR:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  )
}
```

---

## CZI Science Design System (Primary)

The CZI SDS is the **primary source** for UI components and design tokens. Always check SDS first before using other solutions.

### External Resources

- **GitHub Repository:** [chanzuckerberg/sci-components](https://github.com/chanzuckerberg/sci-components)
- **Storybook:** [SDS Component Documentation](https://chanzuckerberg.github.io/sci-components)

Use the Storybook to explore available components, their props, and usage examples.

### SDS Components

**Always prefer SDS components over Material-UI.** SDS provides these commonly used components:

| Component          | Import                | Purpose                              |
| ------------------ | --------------------- | ------------------------------------ |
| `Button`           | `@czi-sds/components` | Primary action buttons               |
| `Icon`             | `@czi-sds/components` | Icons (ChevronDown, ChevronUp, etc.) |
| `InputText`        | `@czi-sds/components` | Text inputs                          |
| `InputCheckbox`    | `@czi-sds/components` | Checkboxes                           |
| `InputRadio`       | `@czi-sds/components` | Radio buttons                        |
| `InputSearch`      | `@czi-sds/components` | Search inputs                        |
| `DropdownMenu`     | `@czi-sds/components` | Dropdown menus                       |
| `Menu`             | `@czi-sds/components` | Navigation menus                     |
| `Dialog`           | `@czi-sds/components` | Modal dialogs                        |
| `Callout`          | `@czi-sds/components` | Alert/notification boxes             |
| `Banner`           | `@czi-sds/components` | Notification banners                 |
| `Accordion`        | `@czi-sds/components` | Collapsible sections                 |
| `Pagination`       | `@czi-sds/components` | Page navigation                      |
| `Table` components | `@czi-sds/components` | Data tables                          |

**Example usage:**

```tsx
import { Button, Icon, InputText } from '@czi-sds/components'

function SearchForm() {
  return (
    <div className="flex gap-sds-m">
      <InputText
        label="Search datasets"
        placeholder="Enter search term..."
        className="flex-1"
      />
      <Button sdsType="primary" sdsStyle="rounded">
        <Icon sdsIcon="Search" sdsSize="s" />
        Search
      </Button>
    </div>
  )
}
```

### SDS Tailwind Tokens

Tokens are imported into Tailwind config from `@czi-sds/components/dist/tailwind.json`. **Always prefer SDS tokens over raw Tailwind values.**

#### Typography Tokens

Typography tokens follow the pattern: `text-sds-{type}-{size}-{weight}-{width}`

| Type      | Sizes                           | Weights  | Widths       | Example                       |
| --------- | ------------------------------- | -------- | ------------ | ----------------------------- |
| `body`    | xxxs, xxs, xs, s, m, l          | 400, 600 | narrow, wide | `text-sds-body-m-400-wide`    |
| `header`  | xxxs, xxs, xs, s, m, l, xl, xxl | 600      | narrow, wide | `text-sds-header-xl-600-wide` |
| `caps`    | xxxxs, xxxs, xxs                | 600      | narrow, wide | `text-sds-caps-xxs-600-wide`  |
| `code`    | xs, s                           | 400, 600 | narrow, wide | `text-sds-code-s-400-wide`    |
| `tabular` | xs, s                           | 400, 600 | narrow, wide | `text-sds-tabular-s-400-wide` |

**Line heights** use `leading-sds-{type}-{size}`:

```tsx
{
  /* Headers */
}
;<h1 className="text-sds-header-xxl-600-wide leading-sds-header-xxl-600-wide">
  Page Title
</h1>

{
  /* Body text */
}
;<p className="text-sds-body-m-400-wide leading-sds-body-m-400-wide">
  Body content
</p>

{
  /* Caps (labels) */
}
;<span className="text-sds-caps-xxs-600-wide leading-sds-caps-xxs-600-wide uppercase">
  LABEL
</span>

{
  /* Code */
}
;<code className="font-sds-code text-sds-code-s-400-wide leading-sds-code-s-400-wide">
  npm install
</code>
```

**Font families:**

| Token              | Font Stack                   |
| ------------------ | ---------------------------- |
| `font-sds-body`    | Inter, system-ui, sans-serif |
| `font-sds-header`  | Inter, system-ui, sans-serif |
| `font-sds-caps`    | Inter, system-ui, sans-serif |
| `font-sds-code`    | IBM Plex Mono, monospace     |
| `font-sds-tabular` | Inter, system-ui, sans-serif |

#### Spacing Tokens

**Always use SDS spacing tokens** for consistent layouts:

| Token         | Value | Usage                   |
| ------------- | ----- | ----------------------- |
| `sds-xxxs`    | 2px   | Tight spacing, icons    |
| `sds-xxs`     | 4px   | Small gaps              |
| `sds-xs`      | 6px   | Compact elements        |
| `sds-s`       | 8px   | Standard small spacing  |
| `sds-m`       | 12px  | Medium spacing          |
| `sds-default` | 12px  | Default (same as sds-m) |
| `sds-l`       | 16px  | Standard spacing        |
| `sds-xl`      | 24px  | Large spacing           |
| `sds-xxl`     | 40px  | Section spacing         |

```tsx
{/* Padding */}
<div className="p-sds-l">           {/* 16px all sides */}
<div className="px-sds-m py-sds-s"> {/* 12px horizontal, 8px vertical */}

{/* Margins */}
<h2 className="mb-sds-m">           {/* 12px bottom margin */}

{/* Gaps */}
<div className="flex gap-sds-s">    {/* 8px gap */}
```

#### Color Tokens

**Prefer semantic colors** over primitive colors for better accessibility and theme support.

**Light mode colors** use the `light-` prefix:

```tsx
{/* Semantic colors (preferred) */}
<p className="text-light-sds-color-semantic-base-text-primary">Primary text</p>
<p className="text-light-sds-color-semantic-base-text-secondary">Secondary text</p>
<div className="bg-light-sds-color-semantic-base-background-primary">Background</div>
<div className="border-light-sds-color-semantic-base-border-primary">Border</div>

{/* Accent colors */}
<button className="bg-light-sds-color-semantic-accent-fill-primary">Action</button>
<a className="text-light-sds-color-semantic-accent-text-action">Link</a>

{/* Status colors */}
<div className="bg-light-sds-color-semantic-positive-surface-secondary">Success</div>
<div className="bg-light-sds-color-semantic-negative-surface-secondary">Error</div>
<div className="bg-light-sds-color-semantic-notice-surface-secondary">Warning</div>
<div className="bg-light-sds-color-semantic-info-surface-secondary">Info</div>
```

**Primitive colors** (use when semantic doesn't fit):

| Color    | Shades                                              | Example                                   |
| -------- | --------------------------------------------------- | ----------------------------------------- |
| `gray`   | 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900 | `bg-light-sds-color-primitive-gray-100`   |
| `blue`   | 100, 200, 300, 400, 500, 600, 700, 800              | `text-light-sds-color-primitive-blue-500` |
| `green`  | 100, 200, 300, 400, 500, 600, 700, 800              | `bg-light-sds-color-primitive-green-100`  |
| `red`    | 100, 200, 300, 400, 500, 600, 700, 800              | `text-light-sds-color-primitive-red-600`  |
| `yellow` | 100, 200, 300, 400, 500, 600, 700, 800              | `bg-light-sds-color-primitive-yellow-100` |
| `purple` | 100, 200, 300, 400, 500, 600, 700, 800              | `bg-light-sds-color-primitive-purple-100` |

#### Icon Sizes

| Token            | Size | Usage            |
| ---------------- | ---- | ---------------- |
| `sds-icon-xs`    | 12px | Inline icons     |
| `sds-icon-s`     | 16px | Standard icons   |
| `sds-icon-input` | 16px | Form input icons |
| `sds-icon-l`     | 24px | Large icons      |
| `sds-icon-xl`    | 32px | Hero icons       |

```tsx
<Icon sdsIcon="ChevronDown" sdsSize="s" className="w-sds-icon-s h-sds-icon-s" />
```

#### Border Radius

| Token              | Value | Usage             |
| ------------------ | ----- | ----------------- |
| `rounded-sds-none` | 0px   | Sharp corners     |
| `rounded-sds-s`    | 2px   | Subtle rounding   |
| `rounded-sds-m`    | 4px   | Standard rounding |
| `rounded-sds-l`    | 20px  | Pill shapes       |

```tsx
<div className="rounded-sds-m">Standard card</div>
<button className="rounded-sds-l">Pill button</button>
```

#### Box Shadows

| Token             | Usage                    |
| ----------------- | ------------------------ |
| `shadow-sds-none` | No shadow                |
| `shadow-sds-s`    | Subtle elevation         |
| `shadow-sds-m`    | Card elevation           |
| `shadow-sds-l`    | Modal/dropdown elevation |

```tsx
<div className="shadow-sds-m rounded-sds-m p-sds-l">Elevated card</div>
```

### Complete Example

```tsx
import { Button, Icon } from '@czi-sds/components'

function DatasetCard({ title, description, count }) {
  return (
    <div className="bg-light-sds-color-semantic-base-background-primary rounded-sds-m shadow-sds-m p-sds-l">
      <h3 className="text-sds-header-m-600-wide leading-sds-header-m-600-wide text-light-sds-color-semantic-base-text-primary mb-sds-s">
        {title}
      </h3>
      <p className="text-sds-body-s-400-wide leading-sds-body-s-400-wide text-light-sds-color-semantic-base-text-secondary mb-sds-m">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sds-caps-xxs-600-wide leading-sds-caps-xxs-600-wide text-light-sds-color-primitive-gray-500 uppercase">
          {count} tomograms
        </span>
        <Button sdsType="secondary" sdsStyle="rounded">
          <Icon sdsIcon="Download" sdsSize="s" />
          Download
        </Button>
      </div>
    </div>
  )
}
```

---

## Emotion (SSR Support)

Emotion is used internally by Material-UI for CSS-in-JS and SSR style extraction.

### Server-Side Rendering

From [`entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx):

```typescript
import createEmotionServer from '@emotion/server/create-instance'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from './createEmotionCache'

export default function handleRequest(/* ... */) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  const html = ReactDOMServer.renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} />
    </CacheProvider>
  )

  const chunks = extractCriticalToChunks(html)
  const styles = chunks.styles.map((style) => (
    `<style data-emotion="${style.key} ${style.ids.join(' ')}">${style.css}</style>`
  )).join('\n')

  // Inject styles into HTML
}
```

**Purpose:**

- Extracts MUI component styles during SSR
- Prevents flash of unstyled content (FOUC)
- Injects critical CSS into `<head>`

**You don't need to interact with Emotion directly** - it works automatically for MUI components.

---

## Styling Decision Tree

Use this tree to decide which styling approach to use:

```
What are you building?
│
├─ A UI component (button, input, icon, menu, dialog)?
│  └─ 1. Check SDS components first → @czi-sds/components
│     └─ SDS has it? → Use SDS component
│     └─ SDS doesn't have it? → 2. Use MUI component
│
├─ Customizing or building a custom component?
│  └─ 3. Use Tailwind CSS
│     • Layout → flex, grid, absolute, etc.
│     • Spacing → Use SDS tokens: gap-sds-m, p-sds-l
│     • Colors → Use SDS tokens: light-sds-color-semantic-*
│     • Typography → Use SDS tokens: text-sds-body-*, text-sds-header-*
│
├─ Complex animations, pseudo-selectors, or styles Tailwind can't handle?
│  └─ 4. Use CSS Modules
│     • Use @apply for SDS Tailwind tokens
│     • Use :global() for MUI class overrides
│
└─ Priority reminder: SDS → MUI → Tailwind → CSS Modules
```

---

## Best Practices

### 1. SDS (Primary)

✅ **Do:**

- **Always check SDS components first** before using anything else
- Use SDS Tailwind tokens for all colors, typography, and spacing
- Prefer `light-sds-color-semantic-*` over primitive colors for accessibility
- Use SDS spacing tokens (`p-sds-l`, `gap-sds-m`) instead of raw values (`p-4`, `gap-3`)
- Use SDS typography tokens (`text-sds-body-m-400-wide`) instead of raw sizes
- Combine SDS components with SDS Tailwind tokens for consistent styling

❌ **Don't:**

- Use MUI or Tailwind when an SDS component exists
- Use raw Tailwind values (`p-4`, `text-lg`) when SDS tokens are available
- Mix SDS and non-SDS colors in the same component
- Skip the SDS component library when building new features

### 2. Material-UI (Secondary)

✅ **Do:**

- **Check SDS first** - use MUI when SDS doesn't have the component
- Style MUI components with Tailwind using SDS tokens
- Leverage MUI accessibility features
- Provide proper aria labels

❌ **Don't:**

- Use MUI when an SDS component exists (Button, Icon, Input, Menu, etc.)
- Use `styled()` from MUI (ESLint will error)
- Use MUI for layout (use Tailwind grid/flex)
- Override MUI styles without good reason

### 3. Tailwind (Customization)

✅ **Do:**

- Use Tailwind for customization and layout (flex, grid, positioning)
- **Always use SDS tokens** with Tailwind (`gap-sds-m`, not `gap-3`)
- Follow mobile-first responsive design
- Use custom breakpoints for precise control
- Group related utilities (layout, spacing, colors)

❌ **Don't:**

- Use raw spacing values (`p-4`) when SDS tokens exist (`p-sds-l`)
- Use raw colors (`text-gray-600`) instead of SDS colors
- Create arbitrary values excessively (`p-[13px]`)
- Mix inline styles with Tailwind

### 4. CSS Modules (Complex Styles)

✅ **Do:**

- Use for complex styles Tailwind can't handle
- Target global MUI classes with `:global()`
- Combine with `@apply` for SDS Tailwind tokens
- Generate TypeScript definitions
- Keep modules small and focused

❌ **Don't:**

- Use for simple layout/spacing (use Tailwind with SDS tokens)
- Create global styles (use Tailwind config)
- Forget to run type generation
- Use overly specific selectors

---

## Performance Considerations

### Tailwind JIT

Tailwind's JIT (Just-In-Time) compiler generates CSS on-demand:

- Only utilities used in code are generated
- Smaller production CSS bundles
- Faster development builds
- Arbitrary values don't bloat CSS

### CSS Modules Optimization

CSS Modules are optimized at build time:

- Class names are hashed for uniqueness
- Unused styles are tree-shaken
- Styles are deduplicated

### MUI Bundle Size

Material-UI is large - import selectively:

```typescript
// ✅ Good: Tree-shakeable imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ❌ Bad: Imports entire library
import { Button, TextField } from '@mui/material'
```

---

## Debugging Styles

### Tailwind DevTools

Install Tailwind CSS IntelliSense extension for VS Code:

- Autocomplete for class names
- Hover previews of styles
- Linting for invalid classes

### CSS Modules Debugging

View generated class names in browser DevTools:

```html
<div class="Filters_boolean__a3kd9">
  <!-- CSS Module class -->
</div>
```

### MUI Theme Debugging

Inspect MUI theme in React DevTools:

```typescript
import { useTheme } from '@mui/material/styles'

function DebugTheme() {
  const theme = useTheme()
  console.log(theme)
}
```

---

## Common Patterns

### Responsive Card Grid

```tsx
function DatasetGrid({ datasets }) {
  return (
    <div className="grid grid-cols-1 screen-667:grid-cols-2 screen-1345:grid-cols-3 gap-sds-l">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="bg-white rounded-lg shadow-card p-sds-l hover:shadow-lg transition-shadow"
        >
          <h3 className="text-sds-header-m leading-sds-header-m mb-sds-s">
            {dataset.title}
          </h3>
          <p className="text-sds-body-s leading-sds-body-s text-gray-600">
            {dataset.description}
          </p>
        </div>
      ))}
    </div>
  )
}
```

### Custom Modal with MUI and Tailwind

```tsx
import { Modal, Box } from '@mui/material'
import styles from './CustomModal.module.css'

function CustomModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className={`${styles.modal} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-sds-xl max-w-2xl shadow-2xl`}
      >
        {children}
      </Box>
    </Modal>
  )
}
```

```css
/* CustomModal.module.css */
.modal {
  /* Smooth entrance animation */
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

## Next Steps

- [GraphQL Integration](../02-data/01-graphql-integration.md) - Data fetching for styled components
- [State Management](../03-state/01-state-management.md) - Managing UI state
- [Feature Flags](../06-cross-cutting/04-feature-flags.md) - Conditional styling based on environment
