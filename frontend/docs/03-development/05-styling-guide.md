# Styling Guide

This guide explains when to use SDS, Material-UI, Tailwind CSS, and CSS Modules for styling in the CryoET Data Portal frontend.


## Quick Decision Tree

```
Need styling? Start here:
│
├─ UI component (button, input, icon, menu, dialog)?
│  └─ 1. Check CZI SDS components first
│     └─ SDS has it? → Use SDS component
│     └─ SDS doesn't have it? → 2. Use Material-UI
│
├─ Customization or custom component?
│  → 3. Use Tailwind CSS (with SDS tokens)
│
└─ Complex styles Tailwind can't handle?
   → 4. Use CSS Modules
```

---

## Styling Layer Priority

The portal uses a layered styling approach:

1. **CZI SDS** (Primary) - Design system components and tokens
2. **Material-UI** (Secondary) - When SDS doesn't have the component
3. **Tailwind CSS** (Customization) - Layout, custom components
4. **CSS Modules** (Complex) - Styles Tailwind can't easily handle

---

## Tailwind CSS

### When to Use Tailwind

Use Tailwind for:
- Layout (flexbox, grid, spacing)
- Typography (font size, weight, line height)
- Colors (text, background, borders)
- Responsive design (breakpoints)
- Common utilities (rounded corners, shadows, opacity)

### Basic Example

```typescript
export function Card({ title, description }: CardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
```

### Responsive Design

Use Tailwind's responsive prefixes:

```typescript
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  px-4
  md:px-8
  lg:px-12
">
  {/* Grid items */}
</div>
```

**Breakpoints** (from `/packages/data-portal/tailwind.config.ts`):
- `screen360`: 360px
- `screen480`: 480px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `screen2040`: 2040px

### Design System Tokens

Tailwind is configured with CZI SDS tokens:

```typescript
// Colors
<div className="bg-sds-color-primary-400 text-white" />

// Spacing
<div className="px-sds-l py-sds-m" />

// Typography
<p className="text-sds-body-m-600" />
```

**Pattern from `/packages/data-portal/app/components/ModalSubtitle.tsx`:**

```typescript
export function ModalSubtitle({ label, value }: Props) {
  return (
    <p className="text-light-sds-color-semantic-base-text-secondary text-sds-body-xs-400-wide leading-sds-body-xs">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </p>
  )
}
```

### Conditional Classes

Use the `cns()` utility for conditional classes:

```typescript
import { cns } from 'app/utils/cns'

export function Button({ variant, disabled }: ButtonProps) {
  return (
    <button
      className={cns(
        'px-4 py-2 rounded font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      Click me
    </button>
  )
}
```

### Common Patterns

**Flexbox layouts:**

```typescript
// Horizontal layout with spacing
<div className="flex items-center gap-4">
  <Icon />
  <span>Text</span>
</div>

// Vertical stack
<div className="flex flex-col space-y-4">
  <Item />
  <Item />
</div>

// Space between
<div className="flex items-center justify-between">
  <Title />
  <Action />
</div>
```

**Grid layouts:**

```typescript
<div className="grid grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>
```

**Hover states:**

```typescript
<div className="
  border rounded
  hover:border-blue-500
  hover:shadow-lg
  transition-all
  cursor-pointer
" />
```

---

## CSS Modules

### When to Use CSS Modules

Use CSS Modules for:
- Complex animations
- Pseudo-elements (::before, ::after)
- Advanced selectors (:nth-child, :focus-within)
- Component-specific styles that can't be expressed with Tailwind
- Styles that need precise control

### File Structure

Create a `.module.css` or `.module.scss` file alongside your component:

```
app/components/Filters/
├── BooleanFilter.tsx
├── BooleanFilter.module.css
└── Filters.module.css
```

### Basic Example

**File:** `/packages/data-portal/app/components/Filters/Filters.module.css`

```css
.boolean {
  display: flex;
  align-items: center;
  gap: 8px;
}

.booleanWrapped {
  flex-wrap: wrap;
}

.selectFilter {
  position: relative;
}

.selectFilter::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: solid transparent;
  border-width: 6px 5px 0;
  border-top-color: currentColor;
}
```

**Usage in component:**

```typescript
import { cns } from 'app/utils/cns'
import styles from './Filters.module.css'

export function BooleanFilter({ wrapped }: Props) {
  return (
    <div
      className={cns(
        styles.boolean,
        wrapped && styles.booleanWrapped,
        // Mix with Tailwind classes
        'pt-sds-m pl-sds-s pb-sds-s'
      )}
    >
      <input type="checkbox" />
      <label>Filter</label>
    </div>
  )
}
```

**From `/packages/data-portal/app/components/Filters/BooleanFilter.tsx`:**
- Combine CSS Module classes with Tailwind using `cns()`
- Use CSS Modules for structural styles
- Use Tailwind for utilities (spacing, colors)

### TypeScript Support

Generate type definitions for CSS Modules:

```bash
# One-time generation
pnpm data-portal build:tcm

# Watch mode
pnpm data-portal dev:tcm
```

This creates `.d.ts` files for type-safe imports:

```typescript
// Auto-generated Filters.module.css.d.ts
export const boolean: string
export const booleanWrapped: string
export const selectFilter: string
```

### Advanced CSS Module Patterns

**Animations:**

```css
.fadeIn {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Complex pseudo-selectors:**

```css
.item:nth-child(odd) {
  background-color: #f9f9f9;
}

.item:focus-within {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

**Nested selectors (SCSS):**

```scss
.card {
  border: 1px solid #ddd;

  &:hover {
    border-color: blue;

    .cardTitle {
      color: blue;
    }
  }

  &.highlighted {
    background-color: yellow;
  }
}
```

---

## Material-UI (MUI)

### When to Use MUI

Use MUI for:
- Complex interactive components (modals, menus, tooltips)
- Accessibility-critical UI patterns
- Components that require sophisticated state management
- Icons

### MUI Components

```typescript
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material'
```

### Styling MUI with Tailwind

**Important:** Use Tailwind for MUI styling, not `styled()` from MUI.

ESLint enforces this:

```javascript
// This will trigger an ESLint error
import { styled } from '@mui/material/styles'

// Use Tailwind instead
<Dialog className="rounded-lg shadow-xl">
  <DialogTitle className="text-2xl font-bold">
    Title
  </DialogTitle>
</Dialog>
```

### MUI Dialog Example

```typescript
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Button } from '@czi-sds/components'

export function ConfirmDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="rounded-lg"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="text-xl font-semibold border-b px-6 py-4">
        Confirm Action
      </DialogTitle>

      <DialogContent className="px-6 py-4">
        <p className="text-gray-600">
          Are you sure you want to continue?
        </p>
      </DialogContent>

      <DialogActions className="px-6 py-4 border-t gap-2">
        <button onClick={onClose} className="px-4 py-2 text-gray-600">
          Cancel
        </button>
        <Button onClick={onConfirm} sdsType="primary" sdsStyle="rounded">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

### MUI Icons

```typescript
import { Download, Info, ChevronRight } from '@mui/icons-material'

export function ActionButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2">
      <Download className="w-5 h-5" />
      <span>Download</span>
    </button>
  )
}
```

### MUI Tooltip

```typescript
import { Tooltip } from '@mui/material'

export function InfoIcon() {
  return (
    <Tooltip
      title="Additional information about this feature"
      placement="top"
      arrow
    >
      <span className="cursor-help text-gray-500">
        <Info className="w-5 h-5" />
      </span>
    </Tooltip>
  )
}
```

---

## [CZI Science Design System](https://github.com/chanzuckerberg/sci-components)

### When to Use SDS

Use SDS components for:
- Buttons, inputs, checkboxes
- Components that should match CZI design standards
- Sharing components across CZI projects

### Common SDS Components

```typescript
import {
  Button,
  InputCheckbox,
  InputDropdown,
  InputSearch,
  InputText,
} from '@czi-sds/components'

export function FormExample() {
  return (
    <div className="space-y-4">
      <InputText
        label="Dataset Name"
        placeholder="Enter name..."
      />

      <InputCheckbox
        label="Include annotations"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />

      <Button sdsType="primary" sdsStyle="rounded">
        Submit
      </Button>
    </div>
  )
}
```

### SDS Design Tokens

SDS tokens are available through Tailwind:

```typescript
// Imported in tailwind.config.ts
import sds from '@czi-sds/components/dist/tailwind.json'

export default {
  theme: {
    extend: {
      ...sds,  // Adds SDS tokens
    },
  },
}
```

**Usage:**

```typescript
<div className="text-sds-color-primary-600 bg-sds-color-gray-100">
  Styled with SDS tokens
</div>
```

---

## Style Organization

### Component File Structure

```
app/components/DataTable/
├── index.ts              # Public exports
├── DataTable.tsx         # Main component (Tailwind)
├── DataTable.module.css  # Complex styles (CSS Modules)
├── DataTableRow.tsx      # Sub-component
└── DataTableHeader.tsx   # Sub-component
```

### Import Order

```typescript
// 1. External libraries
import { Dialog } from '@mui/material'
import { Button } from '@czi-sds/components'

// 2. Internal utilities
import { cns } from 'app/utils/cns'

// 3. CSS Modules (always last)
import styles from './Component.module.css'
```

---

## Best Practices

### 1. Follow the Styling Hierarchy

Always follow: **SDS → MUI → Tailwind → CSS Modules**

```typescript
// Good: Use SDS component
import { Button } from '@czi-sds/components'
<Button sdsStyle="rounded" sdsType="primary">Submit</Button>

// Good: Use MUI when SDS doesn't have it
import Tooltip from '@mui/material/Tooltip'
<Tooltip title="Help text">...</Tooltip>

// Good: Use Tailwind for customization
<div className="flex items-center gap-sds-m p-sds-l rounded-lg border" />

// Avoid: Using Tailwind/CSS when SDS component exists
<button className="bg-blue-600 text-white px-6 py-2 rounded">Submit</button>
```

### 2. Keep CSS Modules Focused

CSS Modules should only contain styles that can't be done with Tailwind:

```css
/* Good: Complex animation */
.fadeSlideIn {
  animation: fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Avoid: Basic utilities (use Tailwind instead) */
.blue {
  color: blue;
}
```

### 3. Combine Strategies

Mix Tailwind and CSS Modules when appropriate:

```typescript
<div
  className={cns(
    styles.complexAnimation,  // CSS Module for animation
    'px-4 py-2 text-gray-800'  // Tailwind for utilities
  )}
/>
```

### 4. Use Semantic Class Names

```typescript
// Good: Describes purpose
<button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
  Submit
</button>

// Avoid: Non-semantic
<button className="blue-btn large">
  Submit
</button>
```

### 5. Maintain Consistent Spacing

Use design system spacing tokens:

```typescript
// Good: Consistent spacing
<div className="px-sds-l py-sds-m gap-sds-s" />

// Avoid: Arbitrary values
<div className="px-[23px] py-[17px]" />
```

---

## Common Styling Tasks

### Creating a Card

```typescript
export function Card({ children }: Props) {
  return (
    <div className="
      border border-gray-200
      rounded-lg
      p-6
      shadow-sm
      hover:shadow-md
      transition-shadow
      bg-white
    ">
      {children}
    </div>
  )
}
```

### Creating a Button

```typescript
export function Button({ variant, children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cns(
        'px-4 py-2 rounded font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      )}
    >
      {children}
    </button>
  )
}
```

### Creating a Form Field

```typescript
export function FormField({ label, error, children }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
```

---

## Troubleshooting

### Styles Not Applying

1. **Check class name spelling** - Typos won't be caught by TypeScript
2. **Ensure Tailwind classes are valid** - Check [Tailwind docs](https://tailwindcss.com/docs)
3. **CSS Module types out of date** - Run `pnpm data-portal build:tcm`
4. **Specificity issues** - Check if other styles are overriding

### CSS Modules Not Working

1. **File extension** - Must be `.module.css` or `.module.scss`
2. **Types not generated** - Run `pnpm data-portal build:tcm`
3. **Import path** - Use relative import: `import styles from './Component.module.css'`

---

## Next Steps

- [Adding New Components](./02-adding-new-components.md) - Apply styling to new components
- [Testing Guide](./06-testing-guide.md) - Test styled components
