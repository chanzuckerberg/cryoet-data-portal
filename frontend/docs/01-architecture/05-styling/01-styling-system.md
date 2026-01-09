# Styling System

This document covers the styling architecture of the CryoET Data Portal frontend, including when to use each approach and practical patterns.

## Quick Start

Need to style something? Follow this decision flowchart:

```
What are you building?
│
├─ UI component (button, input, icon, menu, dialog)?
│  ├─ Check SDS first → Use @czi-sds/components
│  └─ SDS doesn't have it? → Use Material-UI
│
├─ Layout, spacing, or custom component?
│  └─ Use Tailwind CSS with SDS tokens (gap-sds-m, p-sds-l)
│
└─ Complex animations, pseudo-selectors, or MUI overrides?
   └─ Use CSS Modules with @apply for SDS tokens

Priority: SDS → MUI → Tailwind → CSS Modules
```

### Quick Examples

**SDS component with Tailwind layout:**

```tsx
import { Button, Icon } from '@czi-sds/components'
;<div className="flex items-center gap-sds-m">
  <Button sdsType="primary" sdsStyle="rounded">
    <Icon sdsIcon="Download" sdsSize="s" />
    Download
  </Button>
</div>
```

**Conditional classes with `cns()` utility:**

```tsx
import { cns } from 'app/utils/cns'
;<div
  className={cns(
    'px-sds-l py-sds-m rounded-sds-m',
    isActive && 'bg-light-sds-color-semantic-accent-fill-primary',
    disabled && 'opacity-50 cursor-not-allowed',
  )}
/>
```

**CSS Module for complex styles:**

```tsx
import styles from './Component.module.css'
;<div className={cns(styles.animatedCard, 'p-sds-l rounded-sds-m')} />
```

---

## Quick Reference

| Technology             | Purpose                 | When to Use                                               |
| ---------------------- | ----------------------- | --------------------------------------------------------- |
| **CZI SDS Components** | Pre-built design system | **First choice** - buttons, inputs, icons, menus, dialogs |
| **Material-UI**        | Complex components      | **Second choice** - when SDS doesn't provide equivalent   |
| **Tailwind CSS**       | Utility-first styling   | Customization, layout (flex, grid), custom components     |
| **CSS Modules**        | Component-scoped styles | Complex styles not easy to do with Tailwind               |

---

## CZI Science Design System (Primary)

The CZI SDS is the **primary source** for UI components and design tokens. Always check SDS first.

- **Storybook:** [SDS Component Documentation](https://chanzuckerberg.github.io/sci-components)
- **GitHub:** [chanzuckerberg/sci-components](https://github.com/chanzuckerberg/sci-components)

### Available Components

| Component       | Import                | Purpose                  |
| --------------- | --------------------- | ------------------------ |
| `Button`        | `@czi-sds/components` | Primary action buttons   |
| `Icon`          | `@czi-sds/components` | Icons (ChevronDown, etc) |
| `InputText`     | `@czi-sds/components` | Text inputs              |
| `InputCheckbox` | `@czi-sds/components` | Checkboxes               |
| `InputSearch`   | `@czi-sds/components` | Search inputs            |
| `DropdownMenu`  | `@czi-sds/components` | Dropdown menus           |
| `Dialog`        | `@czi-sds/components` | Modal dialogs            |
| `Callout`       | `@czi-sds/components` | Alert boxes              |

### Example: Form with SDS Components

```tsx
import { Button, InputText, InputCheckbox } from '@czi-sds/components'

function SearchForm() {
  return (
    <div className="flex flex-col gap-sds-m">
      <InputText label="Search datasets" placeholder="Enter search term..." />
      <InputCheckbox label="Include annotations" />
      <Button sdsType="primary" sdsStyle="rounded">
        Search
      </Button>
    </div>
  )
}
```

---

## SDS Tailwind Tokens

Design tokens from `@czi-sds/components` are available through Tailwind. **Always prefer SDS tokens over raw Tailwind values.**

### Typography

Pattern: `text-sds-{type}-{size}-{weight}-{width}` with `leading-sds-{type}-{size}`

```tsx
{
  /* Header */
}
;<h1 className="text-sds-header-xl-600-wide leading-sds-header-xl">Title</h1>

{
  /* Body */
}
;<p className="text-sds-body-m-400-wide leading-sds-body-m">Content</p>

{
  /* Label */
}
;<span className="text-sds-caps-xxs-600-wide uppercase">LABEL</span>
```

### Spacing

| Token     | Value | Example Usage              |
| --------- | ----- | -------------------------- |
| `sds-xxs` | 4px   | `gap-sds-xxs` (tight gaps) |
| `sds-s`   | 8px   | `p-sds-s` (small padding)  |
| `sds-m`   | 12px  | `gap-sds-m` (standard)     |
| `sds-l`   | 16px  | `p-sds-l` (content areas)  |
| `sds-xl`  | 24px  | `mb-sds-xl` (sections)     |
| `sds-xxl` | 40px  | `py-sds-xxl` (large gaps)  |

### Colors

**Prefer semantic colors** for accessibility and theming:

```tsx
{/* Text */}
<p className="text-light-sds-color-semantic-base-text-primary">Primary text</p>
<p className="text-light-sds-color-semantic-base-text-secondary">Secondary</p>

{/* Backgrounds */}
<div className="bg-light-sds-color-semantic-base-background-primary" />

{/* Status colors */}
<div className="bg-light-sds-color-semantic-positive-surface-secondary">Success</div>
<div className="bg-light-sds-color-semantic-negative-surface-secondary">Error</div>
```

Primitive colors when semantic doesn't fit: `bg-light-sds-color-primitive-gray-100`

### Other Tokens

```tsx
{/* Border radius */}
<div className="rounded-sds-m">Standard</div>
<button className="rounded-sds-l">Pill button</button>

{/* Shadows */}
<div className="shadow-sds-m">Elevated card</div>

{/* Icon sizes */}
<Icon className="w-sds-icon-s h-sds-icon-s" />
```

---

## Material-UI (Secondary)

Use MUI **only when SDS doesn't provide the component**. Always style with Tailwind/SDS tokens.

### When to Use MUI

- Complex UI patterns not in SDS
- Icons not available in SDS (`@mui/icons-material`)

### Example: Modal with MUI

```tsx
import { Modal, Box } from '@mui/material'
import { Button } from '@czi-sds/components'

function DownloadModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-sds-m p-sds-xl shadow-sds-l max-w-md">
        <h2 className="text-sds-header-l-600-wide mb-sds-m">
          Download Options
        </h2>
        <p className="text-sds-body-m-400-wide mb-sds-l">Select format...</p>
        <div className="flex gap-sds-m justify-end">
          <Button sdsType="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button sdsType="primary">Download</Button>
        </div>
      </Box>
    </Modal>
  )
}
```

### ESLint Enforcement

MUI `styled()` is forbidden - use Tailwind instead:

```typescript
// ❌ Forbidden by ESLint
import { styled } from '@mui/material'

// ✅ Use Tailwind with SDS tokens
<TextField className="w-full" InputProps={{ className: 'text-sds-body-m' }} />
```

---

## Tailwind CSS (Layout & Utilities)

Use Tailwind for layout, customization, and utilities. **Always use SDS tokens.**

### Configuration

From [`tailwind.config.ts`](../../../packages/data-portal/tailwind.config.ts):

```typescript
import sds from '@czi-sds/components/dist/tailwind.json'

export default {
  theme: {
    extend: {
      ...sds, // Imports all SDS tokens
      screens: {
        'screen-360': '360px',
        'screen-512': '512px',
        'screen-667': '667px',
        'screen-1024': '1024px',
        'screen-1345': '1345px',
        'screen-2040': '2040px',
      },
    },
  },
}
```

### Common Layout Patterns

```tsx
{/* Flexbox */}
<div className="flex items-center justify-between gap-sds-m">
  <span>Label</span>
  <Button>Action</Button>
</div>

{/* Grid */}
<div className="grid grid-cols-1 screen-1024:grid-cols-2 screen-1345:grid-cols-3 gap-sds-l">
  <Card />
</div>

{/* Responsive visibility */}
<nav className="hidden screen-1024:block">Desktop Nav</nav>
<nav className="block screen-1024:hidden">Mobile Nav</nav>
```

### Responsive Breakpoints

| Breakpoint    | Width  | Usage         |
| ------------- | ------ | ------------- |
| `screen-360`  | 360px  | Small mobile  |
| `screen-667`  | 667px  | Large mobile  |
| `screen-1024` | 1024px | Tablet        |
| `screen-1345` | 1345px | Desktop       |
| `screen-2040` | 2040px | Large desktop |

---

## CSS Modules (Complex Styles)

Use CSS Modules for styles Tailwind can't handle: animations, pseudo-selectors, MUI overrides.

### File Structure

```
app/components/Filters/
├── Filters.tsx
├── Filters.module.css    # Scoped styles
└── Filters.module.css.d.ts  # Auto-generated types
```

### Example: Animation + MUI Override

From [`Filters.module.css`](../../../packages/data-portal/app/components/Filters/Filters.module.css):

```css
.boolean {
  :global(.MuiFormControlLabel-root) {
    @apply !m-0 !items-center;
  }

  :global(.MuiTypography-root) span span {
    @apply !text-sds-body-s-400-wide font-semibold;
    @apply !text-light-sds-color-primitive-gray-600;
  }

  &:hover :global(.MuiTypography-root) span span {
    @apply !text-black;
  }
}
```

**Key patterns:**

- `:global()` targets MUI class names
- `@apply` uses SDS Tailwind tokens
- `theme()` accesses Tailwind config values

### TypeScript Support

```bash
pnpm data-portal build:tcm  # Generate types once
pnpm data-portal dev:tcm    # Watch mode
```

### Combining with Tailwind

```tsx
import styles from './Card.module.css'
;<div
  className={cns(styles.animatedCard, 'p-sds-l rounded-sds-m shadow-sds-m')}
>
  {/* CSS Module for animation, Tailwind for layout */}
</div>
```

---

## Best Practices

### Do

- **Check SDS first** before using MUI or custom styling
- **Use SDS tokens** with Tailwind (`gap-sds-m`, not `gap-3`)
- **Use semantic colors** (`light-sds-color-semantic-*`) for accessibility
- **Use `cns()`** for conditional classes
- **Generate CSS Module types** for type safety

### Don't

- Use MUI when SDS has the component (Button, Icon, Input)
- Use raw Tailwind values (`p-4`) when SDS tokens exist (`p-sds-l`)
- Use MUI `styled()` (ESLint will error)
- Mix SDS and non-SDS colors in the same component

### Import Order

```typescript
// 1. External libraries
import { Modal } from '@mui/material'
import { Button } from '@czi-sds/components'

// 2. Internal utilities
import { cns } from 'app/utils/cns'

// 3. CSS Modules (always last)
import styles from './Component.module.css'
```

---

## Troubleshooting

### Styles Not Applying

1. **Check spelling** - Tailwind typos won't be caught by TypeScript
2. **Verify class is valid** - Check [Tailwind docs](https://tailwindcss.com/docs)
3. **Run CSS type generation** - `pnpm data-portal build:tcm`
4. **Check specificity** - CSS Modules may need `!important` via `@apply !`

### CSS Modules Not Working

1. **File extension** - Must be `.module.css` or `.module.scss`
2. **Types not generated** - Run `pnpm data-portal build:tcm`
3. **Import path** - Use relative import: `import styles from './Component.module.css'`

---

## Performance Notes

- **Tailwind JIT**: Only used utilities are generated (smaller bundles)
- **CSS Modules**: Class names hashed, unused styles tree-shaken
- **MUI imports**: Use tree-shakeable imports (`import Button from '@mui/material/Button'`)

---

## Next Steps

- [Component Architecture](../04-components/01-component-architecture.md) - Build styled components
- [Adding New Components](../../03-development/02-adding-new-components.md) - Apply styling patterns
- [Testing Guide](../../03-development/06-testing-guide.md) - Test styled components
