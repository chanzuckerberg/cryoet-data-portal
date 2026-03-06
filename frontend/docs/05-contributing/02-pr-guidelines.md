# Pull Request Guidelines

This document outlines the process and expectations for creating pull requests (PRs) in the CryoET Data Portal frontend. Following these guidelines helps maintain code quality, enables effective code review, and ensures smooth integration of changes.


## Quick Checklist

Before submitting a PR, ensure:

- [ ] Code follows [code style guidelines](./01-code-style.md)
- [ ] All tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Linters pass (`pnpm lint`)
- [ ] PR title follows [conventional commits](./03-commit-conventions.md)
- [ ] Description explains what and why
- [ ] Related issues are linked
- [ ] Screenshots included for UI changes

---

## PR Title Format

PR titles **must** follow [conventional commits format](./03-commit-conventions.md). This is enforced by CI.

**Quick examples:**

```
feat: add tomogram filtering by resolution
fix: resolve incorrect dataset count display
docs: update GraphQL integration guide
```

For the full list of types, scopes, and breaking change notation, see [Commit Conventions](./03-commit-conventions.md).

---

## PR Description

A well-written description helps reviewers understand your changes quickly.

### Template Structure

```markdown
## Summary

Brief explanation of what this PR does (1-3 sentences).

## Changes

- Bullet point list of specific changes
- Keep items focused and clear
- Group related changes together

## Testing

- How to test these changes
- What scenarios were tested
- Any test data or setup needed

## Screenshots

(For UI changes only)
Include before/after images or GIFs

## Related Issues

Closes #123
Relates to #456
```

### Example PR Description

```markdown
## Summary

Adds filtering by deposition author name to the browse depositions page,
allowing users to search for depositions by specific authors.

## Changes

- Add author name filter to deposition browse page
- Implement GraphQL query parameter for author filtering
- Update filter panel UI with author search input
- Add E2E tests for author filtering

## Testing

1. Navigate to /browse/depositions
2. Enter an author name in the filter panel
3. Verify results update to show only matching depositions
4. Clear filter and verify all depositions show again

## Screenshots

[Screenshot of new author filter UI]

## Related Issues

Closes #1234
```

---

## Creating a Pull Request

### Step 1: Prepare Your Branch

**Create a feature branch:**

```bash
# Branch naming: <username>/<short-description>
git checkout -b jeremy/author-filtering
git checkout -b jeremy/dataset-count-fix
git checkout -b jeremy/contributing-guide
```

**Keep commits atomic:**

```bash
# ✅ Good - focused commits
git commit -m "feat: add author filter component"
git commit -m "feat: integrate author filter with GraphQL"
git commit -m "test: add E2E tests for author filter"

# ❌ Avoid - too broad
git commit -m "add author filtering feature and fix bugs and update docs"
```

### Step 2: Run Quality Checks

**Before pushing:**

```bash
# 1. Run all tests
cd frontend
pnpm test

# 2. Type check
pnpm type-check

# 3. Lint (auto-fix issues)
pnpm lint:fix

# 4. Run E2E tests (optional but recommended)
pnpm data-portal e2e
```

**Fix any issues before creating the PR.**

### Step 3: Push and Create PR

```bash
# Push your branch
git push -u origin feat/author-filtering

# Create PR via GitHub CLI (optional)
gh pr create --title "feat: add author filtering to depositions" --body "..."

# Or create via GitHub UI
# Navigate to your repository and click "Compare & pull request"
```

### Step 4: Fill Out PR Details

1. **Title:** Use conventional commit format (validated by CI)
2. **Description:** Follow the template structure above
3. **Reviewers:** Tag appropriate team members
4. **Labels:** Add relevant labels (bug, enhancement, documentation, etc.)
5. **Projects:** Link to project board if applicable

---

## CI Checks

All PRs must pass automated CI checks before merging.

### Frontend Tests

**Workflow:** `.github/workflows/frontend-tests.yml`

Runs on every PR that modifies `frontend/**`:

1. **Jest Tests** - Unit and integration tests

   ```bash
   pnpm -r test
   ```

2. **TypeScript Type Checking** - Strict type validation

   ```bash
   pnpm -r type-check
   ```

3. **Dependency Review** - Security vulnerability scanning

### E2E Tests

**Workflow:** `.github/workflows/frontend-pr-e2e-tests.yml`

Runs on every PR that modifies `frontend/**`:

1. **Playwright E2E Tests** - User flow testing
   - Runs on Chromium only (for speed)
   - Tests key user journeys
   - Takes screenshots on failure

### Pre-commit Formatting

**Workflow:** `.github/workflows/formatting.yml`

Validates code formatting:

1. **Pre-commit hooks** - Runs all configured hooks
   - ESLint for JavaScript/TypeScript
   - Prettier for code formatting
   - Stylelint for CSS/SCSS

### Conventional Commits

**Workflow:** `.github/workflows/conventional-commits.yml`

Validates PR title format using `action-semantic-pull-request`.

**Failure example:**

```
❌ PR title "Updated dataset filters" does not follow conventional commits

Expected format: <type>(<scope>): <description>
Example: feat(filters): add author name filtering
```

---

## Code Review Process

### What Reviewers Look For

**Code Quality:**

- [ ] Code is readable and well-structured
- [ ] Complex logic is commented
- [ ] No obvious bugs or edge cases missed
- [ ] Follows project patterns and conventions

**Testing:**

- [ ] Tests cover new functionality
- [ ] Tests are clear and maintainable
- [ ] Edge cases are tested
- [ ] E2E tests for user-facing features

**Performance:**

- [ ] No unnecessary re-renders
- [ ] Queries are optimized
- [ ] Large lists use virtualization
- [ ] Images are optimized

**Accessibility:**

- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] ARIA labels where needed
- [ ] Color contrast meets standards

**Documentation:**

- [ ] Public APIs are documented
- [ ] Complex algorithms explained
- [ ] README updated if needed
- [ ] Architecture docs updated for significant changes

### Responding to Review Comments

**Be responsive:**

- Address feedback within 1-2 business days
- Ask clarifying questions if needed
- Explain your reasoning when disagreeing

**Making changes:**

```bash
# Make requested changes
git add .
git commit -m "refactor: extract filter logic per review feedback"
git push
```

**Resolving comments:**

- Resolve conversations after addressing feedback
- Leave a comment explaining changes made
- Don't resolve if you're still discussing

**Example response:**

```markdown
Good catch! I've extracted the filter logic into a custom hook
and added test coverage. See commit abc123.
```

---

## Merging

### Requirements Before Merge

1. **All CI checks passing** - Green checkmarks on all workflows
2. **At least one approval** - From a code owner or team member
3. **No unresolved comments** - All review feedback addressed
4. **Up to date with main** - Rebase if needed
5. **No merge conflicts**

### Merge Strategy

The project uses **squash and merge** by default:

- All commits are squashed into a single commit
- Commit message is the PR title (must follow conventional commits)
- PR description becomes the commit body

**Result:**

```
feat: add author filtering to depositions (#1234)

- Add author name filter component
- Integrate with GraphQL query
- Add E2E tests for filtering

Co-authored-by: Reviewer Name <reviewer@example.com>
```

---

## Common Issues and Solutions

### CI Check Failures

**Jest tests fail:**

```bash
# Run tests locally to reproduce
pnpm test

# Run specific test file
pnpm test DatasetTable.test.tsx

# Run in watch mode for debugging
pnpm data-portal test:watch
```

**Type checking fails:**

```bash
# Check types locally
pnpm type-check

# Common issues:
# - Missing type definitions
# - Incorrect prop types
# - Using 'any' type
```

**Linting fails:**

```bash
# Auto-fix most issues
pnpm lint:fix

# Check remaining issues
pnpm lint
```

**E2E tests fail:**

```bash
# Run E2E tests locally
pnpm data-portal e2e

# Run in debug mode
pnpm data-portal e2e:debug

# Run in UI mode for interactive debugging
pnpm data-portal e2e:ui
```

### Conventional Commit Title Fails

**Issue:** PR title doesn't follow format

**Solution:**

```
# Edit PR title on GitHub
# Ensure it follows: <type>(<scope>): <description>

❌ "Updated filters"
✅ "feat: add author filtering to depositions"

❌ "Fix bug"
✅ "fix: resolve incorrect dataset count display"
```

### Merge Conflicts

**Resolve conflicts:**

```bash
# Update main branch
git checkout main
git pull

# Rebase your branch
git checkout feat/author-filtering
git rebase main

# Resolve conflicts in your editor
# Then continue rebase
git add .
git rebase --continue

# Force push (rebase rewrites history)
git push --force-with-lease
```

---

## Best Practices

### Keep PRs Small

**Ideal PR size:**

- 100-400 lines of code changed
- Single, focused feature or fix
- Reviewable in 15-30 minutes

**Large PRs:**

- Break into multiple smaller PRs
- Use feature flags for incremental rollout
- Draft PRs for work-in-progress

### Write Clear Commit Messages

```bash
# ✅ Good - explains what and why
git commit -m "feat: add author filter to improve deposition discovery

Users requested ability to find depositions by specific authors.
This adds a new filter input that queries the author_name field."

# ❌ Avoid - too vague
git commit -m "updated code"
```

### Test Your Changes

**Before creating PR:**

1. Test happy path scenarios
2. Test edge cases (empty states, errors)
3. Test on different screen sizes
4. Test keyboard navigation
5. Run automated test suite

### Update Documentation

When your PR changes behavior:

- Update JSDoc comments for changed functions
- Update README if user-facing
- Update architecture docs for significant changes
- Add inline comments for complex logic

---

## Next Steps

- [Commit Conventions](./03-commit-conventions.md) - Detailed commit message format
- [Release Process](./04-release-process.md) - How changes become releases
- [Code Style](./01-code-style.md) - Coding standards reference
- [Claude Code Commands](./06-claude-code-commands.md) - Automate commit and PR creation with `/create-commits` and `/create-pr`
