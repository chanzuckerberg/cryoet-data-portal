# Testing Guide

This guide covers writing unit tests with Jest and end-to-end tests with Playwright for the CryoET Data Portal frontend.

## Quick Reference

| Test Type  | Framework  | Command                       | Location                              |
| ---------- | ---------- | ----------------------------- | ------------------------------------- |
| Unit tests | Jest       | `pnpm test`                   | `*.test.ts(x)` alongside source files |
| E2E tests  | Playwright | `pnpm e2e`                    | `/e2e` directory                      |
| Watch mode | Jest       | `pnpm data-portal test:watch` | -                                     |
| Debug E2E  | Playwright | `pnpm data-portal e2e:debug`  | -                                     |

---

## Testing Philosophy

Choose the right test type based on what you're verifying:

| What to Test                         | Test Type        | Why                             |
| ------------------------------------ | ---------------- | ------------------------------- |
| Component rendering and interactions | Unit (Jest)      | Fast feedback, isolated testing |
| Utility functions and helpers        | Unit (Jest)      | Pure logic, no DOM needed       |
| Critical user flows                  | E2E (Playwright) | Real browser, full stack        |
| Cross-browser compatibility          | E2E (Playwright) | Multiple browser engines        |
| Visual regression                    | E2E (Playwright) | Screenshot comparisons          |

**General guidelines:**

- Test behavior, not implementation details
- Use semantic queries (`getByRole`, `getByText`) over test IDs
- Keep tests isolated and deterministic
- Mock external dependencies in unit tests

---

## Unit Testing with Jest

### Configuration

Jest is configured with TypeScript support (ts-jest ESM preset), React Testing Library, and jsdom environment.

**Configuration file:** `/packages/data-portal/jest.config.cjs`

Key settings:

- `ts-jest/presets/default-esm` preset; `pnpm test` sets `NODE_OPTIONS=--experimental-vm-modules` so Jest can run ES modules
- 10 second timeout for all tests
- CSS modules mocked with `identity-obj-proxy`
- Path alias `app/*` maps to source files
- `react-router` is mapped to its CommonJS build so `jest.mock('react-router', ...)` (used by `app/mocks/Remix.mock.ts`) takes effect; the ESM build can't be mocked with `jest.mock`

**Setup file:** `/packages/data-portal/setupTests.ts` polyfills `TextEncoder`/`TextDecoder` (required by React Router but missing in jsdom), mocks `react-i18next` so `t()` returns the translation key, and stubs `global.fetch`.

### Unit Test Template

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import { MyComponent } from './MyComponent'

describe('<MyComponent />', () => {
  it('should render with required props', () => {
    render(<MyComponent label="Test" onChange={() => {}} />)
    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should handle user interaction', async () => {
    const onChange = jest.fn()
    render(<MyComponent label="Test" onChange={onChange} />)

    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith(/* expected value */)
  })
})
```

**Real examples:**

- Component test: `app/components/Filters/BooleanFilter.test.tsx`
- Utility test: `app/utils/param-parsers.test.ts`
- Select filter test: `app/components/Filters/SelectFilter.test.tsx`

### Testing Components That Use React Router

Components that call React Router hooks (`useSearchParams`, `useLocation`, `useNavigate`, `Link`, ...) need a router context. There are two approaches:

**1. Render inside `createRoutesStub`** (from `react-router`, replaces `createRemixStub` from `@remix-run/testing`):

```typescript
import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router'

const mockReset = jest.fn()

// ESM modules are mocked with unstable_mockModule + dynamic import
jest.unstable_mockModule('app/hooks/useFilter', () => ({
  __esModule: true,
  useFilter: () => ({ reset: mockReset }),
}))

async function renderNoFilteredResults() {
  const { NoFilteredResults } = await import('./NoFilteredResults')

  const NoFilteredResultsStub = createRoutesStub([
    { path: '/', Component: () => <NoFilteredResults /> },
  ])

  render(<NoFilteredResultsStub />)
}
```

See `app/components/NoFilteredResults.test.tsx` and `app/components/Breadcrumbs.test.tsx`.

**2. Mock `react-router` with `RemixMock`** when you need to control or assert on hook values. The class (name kept from the Remix era) lives in `app/mocks/Remix.mock.ts` and calls `jest.mock('react-router', ...)` for `Link`, `useLocation`, `useNavigation`, `useSearchParams`, `useNavigate` and `useParams`:

```typescript
import { RemixMock } from 'app/mocks/Remix.mock'

const remixMock = new RemixMock()

beforeEach(() => remixMock.reset())

it('updates search params', async () => {
  remixMock.mockSearchParams(new URLSearchParams('?foo=bar'))
  const { MultiInputFilter } = await import('./MultiInputFilter')
  render(<MultiInputFilter /* ... */ />)
  // ...
  expect(remixMock.getLastSetParams()?.get('foo')).toBe('baz')
})
```

Create the mock before dynamically importing the component under test. See `app/components/Filters/MultiInputFilter.test.tsx`.

### Common Test Patterns

| Pattern          | Code                                                      | Use Case                   |
| ---------------- | --------------------------------------------------------- | -------------------------- |
| Mock function    | `const fn = jest.fn()`                                    | Track calls, return values |
| Check visibility | `expect(el).toBeVisible()`                                | Element in DOM and visible |
| Check text       | `expect(el).toHaveTextContent('x')`                       | Verify text content        |
| Check value      | `expect(input).toHaveValue('x')`                          | Form input values          |
| Check absence    | `expect(screen.queryByText('x')).not.toBeInTheDocument()` | Element not present        |
| User click       | `await userEvent.click(el)`                               | Simulate click             |
| User type        | `await userEvent.type(el, 'text')`                        | Simulate typing            |
| Wait for async   | `await screen.findByText('x')`                            | Auto-waits for element     |

### Query Priority

Use queries in this order (most to least preferred):

1. **`getByRole`** - Buttons, inputs, headings (best for accessibility)
2. **`getByLabelText`** - Form fields with labels
3. **`getByText`** - Non-interactive text content
4. **`getByTestId`** - Last resort when semantic queries don't work

**Query variants:**

- `getBy*` - Returns element or throws (element must exist)
- `queryBy*` - Returns element or null (for asserting non-existence)
- `findBy*` - Returns promise, waits up to 1s (for async elements)
- `getAllBy*` - Returns array of all matching elements

---

## End-to-End Testing with Playwright

### Configuration

Playwright runs tests across multiple browsers with automatic retries on CI.

**Configuration file:** `/packages/data-portal/playwright.config.ts`

Key settings:

- 60 second timeout (for visual testing with Chromatic)
- Video recording on failure
- 2 retries on CI
- Browsers: Chromium, Firefox, WebKit

### E2E Test Environments

The repository supports three environments: **local**, **staging**, and **prod**. E2E tests are only run in the **local** environment in CI, where a local server is started on port 8080.

When running E2E tests locally against a different environment, you must ensure both the frontend URL and GraphQL endpoint have consistent data. Tests make GraphQL queries using the `API_URL_V2` environment variable, which defaults to production. Running tests against a non-production frontend without setting `API_URL_V2` to match will cause failures due to data mismatches.

### E2E Configuration Override

E2E tests use values from `e2e/config.json`. Override at runtime with `E2E_CONFIG`:

```bash
# Override frontend URL and GraphQL endpoint
API_URL_V2='<graphql-endpoint>' \
E2E_CONFIG='{"url":"<frontend-url>"}' pnpm e2e

# Use specific dataset
E2E_CONFIG='{"datasetId":"12345","runId":"999"}' pnpm e2e
```

**Required config values:** The base `config.json` contains placeholder values that must be overridden:

| Key           | Description                             | Example Value           |
| ------------- | --------------------------------------- | ----------------------- |
| `authorName`  | Author name for filter tests            | `"Author Name"`         |
| `authorOrcId` | Author ORCID for filter tests           | `"0000-0000-0000-0000"` |
| `runId`       | Run ID that exists in the test database | `"19"`                  |

Other available config keys: `url`, `datasetId`, `depositionId`, `organismName1`, `objectName`

### API_URL_V2 Environment Variable

The `API_URL_V2` environment variable specifies the GraphQL endpoint used by E2E tests. This is separate from the frontend URL configured in `E2E_CONFIG`.

**Important:** If `API_URL_V2` is not set, it defaults to the production GraphQL endpoint (`https://graphql.cryoetdataportal.czscience.com/graphql`). This can cause test failures when the frontend and GraphQL endpoint have different data.

### E2E Test Template

Tests import `test` and `expect` from `@chromatic-com/playwright` (v0.14), a drop-in wrapper around `@playwright/test` that also captures Chromatic visual snapshots (archived with Storybook 10 under the hood):

```typescript
import { expect, test } from '@chromatic-com/playwright'

test.describe('Feature Name', () => {
  test('should perform expected action', async ({ page }) => {
    await page.goto('/path')

    // Interact with the page
    await page.click('button:has-text("Action")')

    // Assert outcomes
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page).toHaveURL(/expected-param/)
  })
})
```

**Real examples:**

- Dialog test: `e2e/downloadDialog.test.ts`
- Filter test: `e2e/filters.test.ts`
- Navigation test: `e2e/navigation.test.ts`

### Common E2E Patterns

| Pattern       | Code                                            | Use Case         |
| ------------- | ----------------------------------------------- | ---------------- |
| Navigate      | `await page.goto('/path')`                      | Open a page      |
| Click         | `await page.click('selector')`                  | Click element    |
| Fill input    | `await page.fill('input', 'value')`             | Type in input    |
| Check visible | `await expect(locator).toBeVisible()`           | Element visible  |
| Check URL     | `await expect(page).toHaveURL(/pattern/)`       | URL changed      |
| Wait for text | `await page.waitForSelector('text=Loading')`    | Wait for content |
| Skip browser  | `test.skip(browserName === 'webkit', 'reason')` | Conditional skip |

### Page Object Model

For complex tests, encapsulate page interactions in a class:

```typescript
// e2e/pageObjects/downloadDialogPage.ts
export class DownloadDialogPage {
  constructor(private page: Page) {}

  async openDialog(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`)
  }

  getDialog() {
    return this.page.locator('[role="dialog"]')
  }
}
```

See `e2e/pageObjects/` for full implementations.

---

## Running Tests

### Unit Tests

```bash
pnpm test                        # Run all tests (with coverage)
pnpm data-portal test:watch      # Watch mode
pnpm test path/to/test.test.ts   # Single file
```

### E2E Tests

```bash
pnpm e2e                         # Run all E2E tests
pnpm data-portal e2e:debug       # Interactive Playwright UI mode
pnpm e2e e2e/specific.test.ts    # Single file
E2E_BROWSER=chromium pnpm e2e    # Specific browser
```

---

## Debugging

### Unit Tests

```typescript
// Print component HTML
const { debug } = render(<MyComponent />)
debug()  // Outputs to console
```

### E2E Tests

```bash
pnpm data-portal e2e:debug    # Opens Playwright UI mode (playwright test --ui)
pnpm e2e --headed             # Watch browser execution
```

Videos are automatically recorded on failure. View traces with:

```bash
npx playwright show-trace trace.zip
```

---

## PR Checklist

Before submitting:

- [ ] All existing tests pass
- [ ] New features have unit tests
- [ ] Critical flows have E2E tests
- [ ] Tests are deterministic (no flaky tests)
- [ ] Test names describe expected behavior

---

## Related Guides

- [Adding New Components](./02-adding-new-components.md) - Test patterns for components
- [Adding Filters](./04-adding-filters.md) - Test filter functionality
- [Adding New Routes](./01-adding-new-routes.md) - Test route loaders
