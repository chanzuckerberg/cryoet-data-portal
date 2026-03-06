# Commit Conventions

This document explains the commit message format used in the CryoET Data Portal frontend. We follow the Conventional Commits specification to enable automated changelog generation, semantic versioning, and clear project history.


## Quick Reference

### Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types

| Type       | When to Use             | Version Bump  |
| ---------- | ----------------------- | ------------- |
| `feat`     | New feature             | Minor (0.x.0) |
| `fix`      | Bug fix                 | Patch (0.0.x) |
| `perf`     | Performance improvement | Patch (0.0.x) |
| `docs`     | Documentation only      | None          |
| `style`    | Formatting, whitespace  | None          |
| `refactor` | Code restructuring      | None          |
| `test`     | Test changes            | None          |
| `build`    | Build system changes    | None          |
| `ci`       | CI/CD changes           | None          |
| `chore`    | Maintenance tasks       | None          |
| `revert`   | Revert previous commit  | Depends       |

---

## Conventional Commits Specification

The CryoET Data Portal uses [Conventional Commits](https://www.conventionalcommits.org/) v1.0.0.

### Why Conventional Commits?

**Automated releases:**

- Automatically determine the next version number
- Generate changelog from commit messages
- Create GitHub releases with release notes

**Clear history:**

- Understand what changed at a glance
- Filter commits by type (features, fixes, etc.)
- Track features across releases

**Better collaboration:**

- Standardized format across contributors
- Easier to write and review
- Searchable commit history

---

## Commit Message Structure

### Type (Required)

The type indicates the nature of the change.

**Feature types (bump version):**

```bash
# feat - New feature (minor version bump)
feat: add viewer page for 3D tomogram visualization
feat(filters): add filtering by deposition author
feat: implement global image labels
```

**Fix types (bump version):**

```bash
# fix - Bug fix (patch version bump)
fix: resolve incorrect tomogram count display
fix(viewer): correct annotation layer visibility
fix: preserve deposition method links order
```

**Performance types (bump version):**

```bash
# perf - Performance improvement (patch version bump)
perf: split ESLint config to optimize VS Code performance
perf(table): implement virtualization for large datasets
perf: optimize GraphQL query with fragment caching
```

**Non-version-bumping types:**

```bash
# refactor - Code restructuring (no version bump)
refactor: extract dataset logic into custom hook
refactor(state): migrate from Redux to Jotai

# style - Code style changes (no version bump)
style: fix indentation in DatasetTable component
style: apply Prettier formatting to utils

# test - Test additions/changes (no version bump)
test: add E2E tests for viewer page
test(integration): add dataset filtering tests

# docs - Documentation (no version bump)
docs: add GraphQL integration guide
docs(contributing): update PR guidelines

# build - Build system (no version bump)
build: update Remix to v2.17.0
build: add neuroglancer build step to CI

# ci - CI/CD changes (no version bump)
ci: add E2E test caching
ci: enable Playwright video recording on failure

# chore - Maintenance (no version bump)
chore: update dependencies
chore: add security overrides for form-data
```

### Scope (Optional)

The scope specifies the area of the codebase affected:

```bash
feat(viewer): add tomogram selection dropdown
fix(filters): resolve organism name filter bug
perf(table): optimize rendering with React.memo
refactor(hooks): extract common logic to useDataset
docs(architecture): document state management patterns
test(e2e): add screenshot regression tests
```

**Common scopes:**

- `viewer` - 3D visualization/Neuroglancer
- `filters` - Filtering system
- `table` - Table components
- `hooks` - Custom React hooks
- `graphql` - GraphQL queries/types
- `state` - State management
- `api` - API integration
- `e2e` - End-to-end tests
- `architecture` - Architecture docs
- `contributing` - Contributing docs

### Description (Required)

A concise description of the change:

**Rules:**

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Keep under 72 characters

```bash
# ✅ Good
feat: add author filtering to depositions
fix: resolve incorrect dataset count
refactor: extract filter logic to custom hook

# ❌ Avoid
feat: Added author filtering to depositions  # Wrong tense
fix: Resolve incorrect dataset count.        # Capitalized, period
refactor: Extraction of filter logic         # Not imperative
```

### Body (Optional)

Provide additional context in the body:

```bash
feat: add viewer page for tomogram visualization

Implements a new viewer page that uses Neuroglancer as a library
instead of an iframe. This provides better control over the 3D
visualization and enables integration with our design system.

The viewer supports:
- Multiple tomogram layers
- Annotation overlays
- Custom camera positions
- Responsive layout with controls
```

**When to include a body:**

- Complex changes that need explanation
- Breaking changes (required)
- Migration instructions
- Design decisions

**Formatting:**

- Wrap at 72 characters per line
- Separate paragraphs with blank lines
- Use bullet points for lists

### Footer (Optional)

The footer contains metadata about the commit.

**Breaking changes:**

```bash
feat!: migrate to GraphQL API v3

Update Apollo Client to use the new v3 API endpoint. This changes
the shape of several GraphQL responses.

BREAKING CHANGE: Dataset.status field renamed to Dataset.state.
Update all queries to use the new field name.
```

**Issue references:**

```bash
fix: resolve incorrect tomogram count display

The count was including soft-deleted tomograms. Updated the query
to filter by status.

Closes #1234
Fixes #1235
Relates to #1236
```

**Multiple footers:**

```bash
feat!: add global image labels

Introduces a new image labeling system that replaces the old
annotation system.

BREAKING CHANGE: Annotation API endpoints have changed. See
migration guide in docs/migration-v2.md.

Closes #1958
Co-authored-by: Jane Doe <jane@example.com>
```

---

## Breaking Changes

Breaking changes require special notation and **always** trigger a major version bump.

### Format 1: Type with `!`

```bash
feat!: migrate to GraphQL API v3

BREAKING CHANGE: All GraphQL queries must be updated to use the
new API endpoint. See migration guide for details.
```

### Format 2: Footer only

```bash
feat: add global image labels

BREAKING CHANGE: The old annotation system is removed. Migrate
to the new image labeling API.
```

### Both formats trigger major version bump

```
1.78.0 → 2.0.0
```

---

## Examples from the Codebase

These examples are from actual commits in the repository:

### Feature Addition

```bash
feat: Add tomogram selection dropdown to the viewer page

Adds a dropdown menu to select different tomograms within the
same dataset. The viewer updates dynamically when a new tomogram
is selected.

Closes #1989
```

**Changelog entry:**

```markdown
## ✨ Features

- Add tomogram selection dropdown to the viewer page (#1989)
```

### Bug Fix

```bash
fix: add tomogram count to deposition + update browse depositions description copy

The deposition cards were missing tomogram counts. This adds the
count field and updates the description text for consistency.

Fixes #1988
```

**Changelog entry:**

```markdown
## 🐞 Bug Fixes

- add tomogram count to deposition + update browse depositions description copy (#1988)
```

### Performance Improvement

```bash
perf: split ESLint config to optimize VS Code performance by excluding TypeScript type-checking rules

TypeScript type-checking rules are slow in VS Code. This splits
the ESLint config into fast (default) and comprehensive (opt-in)
modes. The default config skips type-checking for better IDE
performance.

Closes #1965
```

**Changelog entry:**

```markdown
## ⚡️ Performance Improvements

- split ESLint config to optimize VS Code performance (#1965)
```

### Documentation

```bash
docs(architecture): add GraphQL integration guide

Documents how GraphQL is integrated with Apollo Client, including
code generation, query patterns, and SSR configuration.
```

**No changelog entry** - docs don't trigger version bumps.

### Chore

```bash
chore: update dependencies

Updates all non-breaking dependencies to their latest versions.
Includes security patches for form-data and path-to-regexp.
```

**Changelog entry:**

```markdown
## 🧹 Miscellaneous Chores

- update dependencies (#1955)
```

---

## Writing Good Commit Messages

### Be Specific

```bash
# ❌ Too vague
fix: fix bug
feat: add feature
refactor: update code

# ✅ Specific
fix: resolve dataset count showing archived items
feat: add deposition author name filtering
refactor: extract GraphQL queries to separate files
```

### Explain Why

```bash
# ❌ Only explains what
feat: add caching to API calls

# ✅ Explains what and why
feat: add caching to API calls

Reduces API requests by caching responses for 5 minutes.
This improves performance and reduces server load for
frequently accessed datasets.
```

### Use Present Tense

```bash
# ❌ Past tense
feat: added filtering
fix: resolved bug
refactor: extracted logic

# ✅ Imperative (present tense)
feat: add filtering
fix: resolve bug
refactor: extract logic
```

### One Concept Per Commit

```bash
# ❌ Multiple concepts
feat: add author filtering and fix count bug and update docs

# ✅ Separate commits
feat: add author filtering to depositions
fix: resolve incorrect dataset count display
docs: update filtering documentation
```

---

## Commit Message Templates

### Feature with Body

```bash
feat(viewer): add annotation layer controls

Adds controls to show/hide annotation layers in the 3D viewer.
Each layer can be toggled independently, and visibility state
is preserved in the URL.

- Add layer visibility toggles to sidebar
- Update URL state when layers change
- Persist visibility across page reloads
```

### Bug Fix with Issue Reference

```bash
fix(filters): resolve organism name filter not working

The organism filter was querying the wrong field in the GraphQL
query. Updated to use the correct organismName field.

Fixes #1960
```

### Breaking Change

```bash
feat!: migrate to Apollo Client v4

Upgrades Apollo Client from v3 to v4 with improved type safety
and performance.

BREAKING CHANGE: The cache configuration API has changed.
Projects must update their Apollo Client initialization:

Before:
new ApolloClient({ cache: new InMemoryCache() })

After:
new ApolloClient({ cache: new InMemoryCache({ ... }) })

See migration guide: docs/apollo-v4-migration.md
```

### Revert

```bash
revert: undo experimental filter changes

This reverts commit a1b2c3d4e5f6.

The experimental filter UI caused performance issues in production.
Reverting until optimization work is complete.
```

---

## Tools and Validation

### Pre-commit Validation

Commit messages are **not** validated by pre-commit hooks (only PR titles are validated).

However, you can validate locally:

```bash
# Install commitlint (optional)
npm install -g @commitlint/cli @commitlint/config-conventional

# Validate last commit
commitlint --from HEAD~1 --to HEAD
```

### PR Title Validation

PR titles **must** follow conventional commits format (enforced by CI):

```yaml
# .github/workflows/conventional-commits.yml
- uses: amannn/action-semantic-pull-request@v5
```

**Failed check:**

```
❌ Pull request title "Updated filters" does not match conventional commits format.

Expected: <type>(<scope>): <description>
Example: feat(filters): add organism name filtering
```

---

## Changelog Generation

Commits are automatically organized into changelog sections based on type.

### Section Mapping

From `release-please.config.json`:

```json
{
  "changelog-sections": [
    { "type": "feat", "section": "✨ Features" },
    { "type": "fix", "section": "🐞 Bug Fixes" },
    { "type": "perf", "section": "⚡️ Performance Improvements" },
    { "type": "revert", "section": "↩️ Reverts" },
    { "type": "docs", "section": "📝 Documentation" },
    { "type": "style", "section": "💅 Styles" },
    { "type": "chore", "section": "🧹 Miscellaneous Chores" },
    { "type": "refactor", "section": "♻️ Code Refactoring" },
    { "type": "test", "section": "🧪 Tests" },
    { "type": "build", "section": "🛠️ Build System" },
    { "type": "ci", "section": "⚙ Continuous Integration" }
  ]
}
```

### Example Changelog

```markdown
# Changelog

## [1.79.0](https://github.com/.../compare/v1.78.0...v1.79.0) (2025-12-08)

### ✨ Features

- Add tomogram selection dropdown to the viewer page (#1989)
- Add global image labels (#1958)

### 🐞 Bug Fixes

- organism name filter not working in annotations and tomograms tabs (#1960)
- add tomogram count to deposition (#1988)

### ⚡️ Performance Improvements

- split ESLint config to optimize VS Code performance (#1965)
```

---

## Next Steps

- [Release Process](./04-release-process.md) - How commits trigger releases
- [Pull Request Guidelines](./02-pr-guidelines.md) - PR title requirements
- [Code Style](./01-code-style.md) - Code quality standards
- [Claude Code Commands](./06-claude-code-commands.md) - Automate commit creation with `/create-commits`
