# Testing Guide

This guide covers writing unit tests with Jest and end-to-end tests with Playwright for the CryoET Data Portal frontend.


## Quick Reference

| Test Type | Framework | Command | Location |
|-----------|-----------|---------|----------|
| Unit tests | Jest | `pnpm test` | `*.test.ts(x)` alongside source files |
| E2E tests | Playwright | `pnpm e2e` | `/e2e` directory |
| Watch mode | Jest | `pnpm data-portal test:watch` | - |
| Debug E2E | Playwright | `pnpm data-portal e2e:debug` | - |

---

## Unit Testing with Jest

### Test Setup

Jest is configured with:
- **TypeScript support** via ts-jest
- **React Testing Library** for component testing
- **jsdom** environment for DOM simulation
- **10 second timeout** for all tests

**Configuration:** `/packages/data-portal/jest.config.cjs`

```javascript
module.exports = {
  testTimeout: 10000,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
    '^(.*).module.css$': 'identity-obj-proxy',
  },
}
```

---

## Writing Unit Tests

### 1. Basic Component Test

**Pattern from `/packages/data-portal/app/components/Filters/BooleanFilter.test.tsx`:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import { BooleanFilter } from './BooleanFilter'

describe('<BooleanFilter />', () => {
  it('should render label', () => {
    render(<BooleanFilter label="Test Label" onChange={() => {}} value={false} />)

    expect(screen.getByText('Test Label')).toBeVisible()
  })

  it('should render initial value', () => {
    render(<BooleanFilter label="label" onChange={() => {}} value />)

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    const onChange = jest.fn()

    render(<BooleanFilter label="label" onChange={onChange} value={false} />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
```

**Key patterns:**
- Use `describe()` to group related tests
- Use `it()` or `test()` for individual test cases
- Use `jest.fn()` to create mock functions
- Use `@testing-library/user-event` for realistic user interactions
- Use semantic queries (`getByRole`, `getByText`, `getByLabelText`)

### 2. Testing with User Interactions

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<SearchBar />', () => {
  it('should update search value on input', async () => {
    const onSearch = jest.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'ribosome')

    expect(input).toHaveValue('ribosome')
  })

  it('should call onSearch when submit button clicked', async () => {
    const onSearch = jest.fn()
    render(<SearchBar onSearch={onSearch} />)

    await userEvent.type(screen.getByRole('textbox'), 'membrane')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))

    expect(onSearch).toHaveBeenCalledWith('membrane')
  })
})
```

### 3. Testing SelectFilter Component

**Pattern from `/packages/data-portal/app/components/Filters/SelectFilter.test.tsx`:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectFilter } from './SelectFilter'

describe('<SelectFilter />', () => {
  const options = [
    { value: 'Option 1' },
    { value: 'Option 2' },
    { value: 'Option 3' },
  ]

  it('should render options when clicked', async () => {
    render(<SelectFilter label="label" options={options} onChange={() => {}} />)

    const button = await screen.findByRole('button')
    await userEvent.click(button)

    options.forEach(({ value }) => {
      expect(screen.getByText(value)).toBeVisible()
    })
  })

  it('should update value when option selected', async () => {
    const onChange = jest.fn()
    render(<SelectFilter label="label" options={options} onChange={onChange} />)

    const button = await screen.findByRole('button')
    await userEvent.click(button)
    await userEvent.click(screen.getByText('Option 2'))

    expect(screen.getByText('Option 2')).toBeVisible()
  })

  it('should support multiple selection', async () => {
    render(
      <SelectFilter
        label="label"
        options={options}
        onChange={() => {}}
        multiple
      />
    )

    const button = await screen.findByRole('button')
    await userEvent.click(button)
    await userEvent.click(screen.getByText('Option 1'))
    await userEvent.click(screen.getByText('Option 2'))
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText('Option 1')).toBeVisible()
    expect(screen.getByText('Option 2')).toBeVisible()
  })

  it('should filter options when searching', async () => {
    render(
      <SelectFilter
        label="label"
        options={options}
        onChange={() => {}}
        search
      />
    )

    const button = await screen.findByRole('button')
    await userEvent.click(button)

    const combobox = await screen.findByRole('combobox')
    await userEvent.type(combobox, '1')

    expect(screen.getByText('Option 1')).toBeVisible()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
  })
})
```

### 4. Testing Utility Functions

**Pattern from `/packages/data-portal/app/utils/param-parsers.test.ts`:**

```typescript
import { parseNumber, parseBoolean, parseArray } from './param-parsers'

describe('parseNumber', () => {
  it('should parse valid number', () => {
    expect(parseNumber('42')).toBe(42)
    expect(parseNumber('3.14')).toBe(3.14)
  })

  it('should return null for invalid input', () => {
    expect(parseNumber('abc')).toBeNull()
    expect(parseNumber('')).toBeNull()
    expect(parseNumber(null)).toBeNull()
  })
})

describe('parseBoolean', () => {
  it('should parse truthy values', () => {
    expect(parseBoolean('true')).toBe(true)
    expect(parseBoolean('1')).toBe(true)
    expect(parseBoolean('yes')).toBe(true)
  })

  it('should parse falsy values', () => {
    expect(parseBoolean('false')).toBe(false)
    expect(parseBoolean('0')).toBe(false)
    expect(parseBoolean('no')).toBe(false)
  })
})

describe('parseArray', () => {
  it('should split comma-separated values', () => {
    expect(parseArray('a,b,c')).toEqual(['a', 'b', 'c'])
  })

  it('should handle single value', () => {
    expect(parseArray('single')).toEqual(['single'])
  })

  it('should return empty array for empty input', () => {
    expect(parseArray('')).toEqual([])
    expect(parseArray(null)).toEqual([])
  })
})
```

---

## React Testing Library Queries

### Query Priority

Use queries in this priority order:

1. **Accessible queries** (best for users and accessibility):
   - `getByRole` - Buttons, inputs, headings
   - `getByLabelText` - Form fields
   - `getByPlaceholderText` - Inputs with placeholders
   - `getByText` - Non-interactive text content

2. **Semantic queries**:
   - `getByAltText` - Images
   - `getByTitle` - Elements with title attribute

3. **Test IDs** (last resort):
   - `getByTestId` - When semantic queries don't work

### Query Variants

```typescript
// getBy* - Returns element or throws error
const button = screen.getByRole('button')

// queryBy* - Returns element or null (for asserting non-existence)
const error = screen.queryByText('Error message')
expect(error).not.toBeInTheDocument()

// findBy* - Returns promise, waits for element (for async)
const loaded = await screen.findByText('Data loaded')

// getAllBy* - Returns array of elements
const items = screen.getAllByRole('listitem')
```

### Common Queries

```typescript
// By role (preferred)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /username/i })
screen.getByRole('checkbox', { checked: true })

// By text
screen.getByText('Welcome')
screen.getByText(/hello world/i) // Case insensitive regex

// By label
screen.getByLabelText('Email address')

// By placeholder
screen.getByPlaceholderText('Enter your email')

// By test ID (avoid if possible)
screen.getByTestId('custom-element')
```

---

## Testing Async Behavior

### Waiting for Elements

```typescript
it('should load data asynchronously', async () => {
  render(<DataList />)

  // Wait for loading to disappear
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  // Or use findBy* which automatically waits
  const data = await screen.findByText('Data loaded')
  expect(data).toBeVisible()
})
```

### Testing API Calls

```typescript
import { jest } from '@jest/globals'

it('should fetch data on mount', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    json: async () => ({ data: [] }),
  })
  global.fetch = mockFetch

  render(<DataComponent />)

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith('/api/data')
  })
})
```

---

## End-to-End Testing with Playwright

### E2E Test Setup

Playwright is configured for:
- **Multi-browser testing** (Chromium, Firefox, WebKit)
- **60 second timeout** (increased for Chromatic visual testing)
- **Video on failure** for debugging
- **2 retries on CI**

**Configuration:** `/packages/data-portal/playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

### E2E Test Configuration

E2E tests use configuration values from `e2e/config.json`. You can override these values at runtime using the `E2E_CONFIG` environment variable.

**Base config file:** `/packages/data-portal/e2e/config.json`

**Key configuration values:**

| Key | Description | Default |
|-----|-------------|---------|
| `url` | Base URL for tests | `http://localhost:8080` |
| `datasetId` | Dataset ID for single dataset tests | `10001` |
| `runId` | Run ID for single run tests | `258` |
| `depositionId` | Deposition ID for deposition tests | `10000` |
| `organismName1` | Organism name for filter tests | `Bacillus subtilis` |
| `objectName` | Object name for filter tests | `membrane-enclosed lumen` |

**How it works:**

The `E2E_CONFIG` environment variable accepts a JSON string that gets deep-merged with the base config using lodash's `merge()`. This is handled in `e2e/constants.ts`:

```typescript
export const E2E_CONFIG = merge(
  baseConfig,
  JSON.parse(process.env.E2E_CONFIG ?? '{}'),
) as E2EConfig
```

**Override examples:**

```bash
# Run tests against a different URL (e.g., staging)
E2E_CONFIG='{"url":"https://staging.cryoetdataportal.czscience.com"}' pnpm e2e

# Use a specific dataset ID
E2E_CONFIG='{"datasetId":"12345"}' pnpm e2e

# Multiple overrides
E2E_CONFIG='{"url":"https://staging.cryoetdataportal.czscience.com","datasetId":"12345","runId":"999"}' pnpm e2e
```

**Setting in `.env` file:**

You can also set `E2E_CONFIG` in your `.env` file:

```bash
E2E_CONFIG={"url":"https://staging.cryoetdataportal.czscience.com"}
```

See `/packages/data-portal/.env.sample` for the default configuration.

---

## Writing E2E Tests

### 1. Basic Page Test

```typescript
import { test, expect } from '@playwright/test'

test('should display homepage', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('CryoET Data Portal')
  await expect(page.locator('nav')).toBeVisible()
})
```

### 2. Dialog/Modal Test

**Pattern from `/packages/data-portal/e2e/downloadDialog.test.ts`:**

```typescript
import { test, expect } from '@playwright/test'

test.describe('downloadDialog', () => {
  test('should open when clicking download button', async ({ page }) => {
    await page.goto('/datasets/10000')
    await page.click('text=Download Dataset')

    // Wait for dialog to appear
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Download Dataset')
  })

  test('should switch tabs', async ({ page }) => {
    await page.goto('/datasets/10000?modal=download&tab=aws')

    // Click API tab
    await page.click('button:has-text("API")')

    // Verify URL updated
    await expect(page).toHaveURL(/tab=api/)

    // Verify content changed
    await expect(page.locator('[role="dialog"]')).toContainText('Python API')
  })

  test('should close when clicking X button', async ({ page }) => {
    await page.goto('/datasets/10000?modal=download')

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    await page.click('[aria-label="Close"]')
    await expect(dialog).not.toBeVisible()
  })
})
```

### 3. Form Interaction Test

```typescript
test('should submit search form', async ({ page }) => {
  await page.goto('/browse-data/datasets')

  // Fill in search
  await page.fill('input[placeholder="Search"]', 'ribosome')

  // Click search button
  await page.click('button:has-text("Search")')

  // Wait for results
  await page.waitForURL(/search=ribosome/)

  // Verify results
  const results = page.locator('[data-testid="dataset-card"]')
  await expect(results).toHaveCount(5)
})
```

### 4. Filter Test

```typescript
test('should filter datasets by object name', async ({ page }) => {
  await page.goto('/datasets/123')

  // Open filter panel
  await page.click('button:has-text("Filters")')

  // Select filter option
  await page.click('button:has-text("Object Name")')
  await page.click('text=ribosome')

  // Verify URL updated
  await expect(page).toHaveURL(/object-name=ribosome/)

  // Verify filtered results
  const runCount = await page.locator('[data-testid="run-row"]').count()
  expect(runCount).toBeGreaterThan(0)
})
```

### 5. Clipboard Test

```typescript
test('should copy command to clipboard', async ({ page, browserName }) => {
  // Skip for WebKit (clipboard API issues)
  test.skip(browserName === 'webkit', 'WebKit clipboard not supported')

  await page.goto('/datasets/10000?modal=download&tab=aws')

  // Click copy button
  await page.click('button:has-text("Copy")')

  // Read clipboard
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  )

  expect(clipboardText).toContain('aws s3 sync')
})
```

---

## Page Object Model

For complex E2E tests, use the Page Object pattern:

**File:** `/e2e/pageObjects/downloadDialog/downloadDialogPage.ts`

```typescript
import { Page } from '@playwright/test'

export class DownloadDialogPage {
  constructor(private page: Page) {}

  async goTo(url: string) {
    await this.page.goto(url)
  }

  async openDialog(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`)
  }

  getDialog() {
    return this.page.locator('[role="dialog"]')
  }

  async clickTab(tabName: string) {
    await this.page.click(`button:has-text("${tabName}")`)
  }

  async clickCopyButton() {
    await this.page.click('button:has-text("Copy")')
  }

  async clickCloseButton() {
    await this.page.click('[aria-label="Close"]')
  }

  async expectDialogToBeHidden() {
    await this.page.locator('[role="dialog"]').waitFor({ state: 'hidden' })
  }
}
```

**Usage:**

```typescript
import { DownloadDialogPage } from './pageObjects/downloadDialog/downloadDialogPage'

test('should open and close dialog', async ({ page }) => {
  const dialogPage = new DownloadDialogPage(page)

  await dialogPage.goTo('/datasets/10000')
  await dialogPage.openDialog('Download Dataset')

  const dialog = dialogPage.getDialog()
  await expect(dialog).toBeVisible()

  await dialogPage.clickCloseButton()
  await dialogPage.expectDialogToBeHidden()
})
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm data-portal test:watch

# Run tests with coverage
pnpm data-portal test:cov

# Run specific test file
pnpm test path/to/test.test.ts
```

### E2E Tests

```bash
# Run all E2E tests
pnpm e2e

# Run in debug mode (with UI)
pnpm data-portal e2e:debug

# Run in interactive UI mode
pnpm data-portal e2e:ui

# Run specific test file
pnpm e2e e2e/downloadDialog.test.ts

# Run specific browser
E2E_BROWSER=chromium pnpm e2e
```

---

## Best Practices

### Unit Tests

1. **Test behavior, not implementation** - Focus on what users see and do
2. **Use semantic queries** - Prefer `getByRole` over `getByTestId`
3. **Mock external dependencies** - Don't make real API calls
4. **Keep tests isolated** - Each test should be independent
5. **Test edge cases** - Empty states, errors, loading states
6. **Use descriptive test names** - "should display error when API fails"

### E2E Tests

1. **Test critical user flows** - Login, checkout, data download
2. **Keep tests focused** - One user action per test
3. **Use stable selectors** - Prefer text content, roles, ARIA labels
4. **Handle async operations** - Use `waitFor`, `expect().toBeVisible()`
5. **Clean up state** - Reset between tests if needed
6. **Test across browsers** - Run on Chromium, Firefox, WebKit

---

## Debugging Tests

### Unit Test Debugging

```typescript
// Add debug output
import { render, screen } from '@testing-library/react'

it('should render component', () => {
  const { debug } = render(<MyComponent />)

  // Print component HTML
  debug()

  // Print specific element
  debug(screen.getByRole('button'))
})
```

### E2E Test Debugging

```bash
# Run in debug mode with Playwright Inspector
pnpm data-portal e2e:debug

# Run with headed browser
pnpm e2e --headed

# Generate trace on failure (already configured)
pnpm e2e
# View trace: npx playwright show-trace trace.zip
```

### Screenshots and Videos

```typescript
// Take screenshot in E2E test
await page.screenshot({ path: 'screenshot.png' })

// Videos are automatically recorded on failure (configured)
```

---

## Testing Checklist

Before submitting a PR, ensure:

- [ ] All existing tests pass
- [ ] New features have unit tests
- [ ] Critical flows have E2E tests
- [ ] Edge cases are tested
- [ ] Tests are deterministic (no flaky tests)
- [ ] Test names clearly describe what's being tested

---

## Next Steps

- [Adding New Components](./02-adding-new-components.md) - Write tests for your components
- [Adding Filters](./04-adding-filters.md) - Test filter functionality
- [Adding New Routes](./01-adding-new-routes.md) - Test route loaders and components
