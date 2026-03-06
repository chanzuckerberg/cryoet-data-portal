# Claude Code Commands

This document describes the custom Claude Code commands available in the CryoET Data Portal repository for automating git workflows. These commands help create well-structured commits and pull requests following project conventions.


## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/create-commits` | Create logical commits with validation | After making changes, before PR |
| `/create-pr` | Create PR from existing commits | After `/create-commits` |

---

## Prerequisites

- Claude Code installed and configured
- Repository cloned locally
- Changes ready to commit (staged or unstaged)

---

## /create-commits

Creates logical, well-structured commits with intelligent grouping by function, descriptive messages, and code quality validation.

### Usage

```
/create-commits
```

### What It Does

1. **Branch Management**
   - Checks current branch
   - Creates a new feature branch if on `main` (format: `<scope>/auto-<timestamp>-<description>`)
   - Validates base branch exists

2. **Pre-Commit Validation**
   - **Frontend changes:** Runs `pnpm lint`, `pnpm lint:fix`, and `pnpm data-portal type-check`
   - **Python changes:** Runs `make coverage`
   - **Documentation changes:** Runs `make html`

3. **Intelligent File Grouping**
   - Groups related files into logical commits
   - Maintains proper commit order (dependencies before dependents)

4. **Commit Message Generation**
   - Uses conventional commit format (`<type>: <description>`)
   - Analyzes changes to determine appropriate scope

### File Grouping Logic

| Category | File Patterns |
|----------|--------------|
| **UI Components** | `frontend/**/*.tsx` in `/components/` |
| **GraphQL Operations** | `frontend/**/*.server.ts` in `/graphql/` |
| **Type Definitions** | `frontend/**/__generated_v2__/**/*.ts` |
| **Translations** | `frontend/**/translation.json` |
| **Frontend Config** | `frontend/**/*.config.*`, `frontend/package.json` |
| **Frontend Tests** | `frontend/**/*.test.*`, `frontend/**/*.spec.*` |
| **Python Source** | `client/python/**/*.py` (by module) |
| **Python Tests** | `client/python/**/test_*.py` |
| **Documentation** | `docs/**/*.md`, `docs/**/*.rst` |
| **CI/CD** | `.github/**/*` |

### Example Output

```bash
# Creates commits like:
feat: add dataset metadata display table
refactor: extract reusable metadata components
test: add unit tests for metadata table
```

### Error Handling

- **Lint failures:** Attempts auto-fix, pauses if manual fix needed
- **Type check failures:** Displays errors, requires manual resolution
- **Git conflicts:** Suggests rebasing, pauses for resolution

---

## /create-pr

Creates a pull request from existing commits. Should be used after `/create-commits`.

### Usage

```bash
/create-pr                           # Basic PR to main
/create-pr --draft                   # Create as draft PR
/create-pr --issue 123               # Link to issue #123
/create-pr --base develop            # PR to develop branch
/create-pr --draft --issue 123       # Combine flags
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--draft` | Create PR in draft mode | `false` |
| `--issue <number>` | Link PR to GitHub issue | None |
| `--base <branch>` | Target branch for PR | `main` |

### What It Does

1. **Validates Prerequisites**
   - Confirms current branch has unpushed commits
   - Validates base branch exists
   - Checks branch is not behind remote

2. **Pushes Branch**
   - Pushes to origin with `-u` flag if needed

3. **Generates PR Content**
   - **Title:** Derived from commit messages using conventional format
   - **Body:** Includes issue reference, summary, changes, and testing instructions

4. **Creates PR**
   - Uses GitHub CLI (`gh pr create`)
   - Adds appropriate flags based on options

### PR Body Format

When an issue is linked:

```markdown
#123

## Summary
Brief overview derived from commit messages...

## Changes
- List of modifications from commit history...

## Testing
- Frontend: `cd frontend && pnpm test` and `pnpm e2e`
- Python: `cd client/python/cryoet_data_portal && make coverage`
- Docs: `cd docs && make html`
```

### Example

```bash
# After making changes to deposition filters:
/create-commits
# Creates: feat: add author filtering to depositions

/create-pr --issue 1234
# Creates PR with title: feat: add author filtering to depositions
# Body includes #1234 reference and testing instructions
```

---

## Typical Workflow

### 1. Make Your Changes

```bash
# Work on your feature
git checkout -b jeremy/author-filtering
# ... make code changes ...
```

### 2. Create Commits

```
/create-commits
```

Claude Code will:
- Run linting and type checks
- Group your changes logically
- Create commits with proper messages

### 3. Create Pull Request

```
/create-pr --issue 1234
```

Claude Code will:
- Push your branch
- Generate PR title and description
- Create the PR with issue link

### 4. Review Output

```
Created PR: https://github.com/chanzuckerberg/cryoet-data-portal/pull/1999

Commits:
- feat: add author filter component
- feat: integrate author filter with GraphQL
- test: add E2E tests for author filter

Next steps:
- Review the PR description
- Request reviewers
- Monitor CI checks
```

---

## Comparison with Manual Workflow

| Task | Manual | With Claude Code Commands |
|------|--------|--------------------------|
| **Lint & type check** | Run commands, fix issues | Automatic with auto-fix |
| **Stage files** | `git add` per logical group | Automatic grouping |
| **Write commit messages** | Craft each message | Generated from changes |
| **Push branch** | `git push -u origin branch` | Automatic |
| **Create PR** | Fill out form on GitHub | Generated from commits |
| **Link issues** | Add to PR description | `--issue` flag |

---

## Troubleshooting

### "No changes to commit"

Ensure you have staged or unstaged changes before running `/create-commits`.

### "Branch is behind base"

```bash
git fetch origin main
git rebase origin/main
# Then retry /create-commits
```

### "Type check failures"

Review the TypeScript errors displayed. If GraphQL types are stale:

```bash
cd frontend && pnpm data-portal build:codegen
```

### "Lint failures after auto-fix"

Some lint errors require manual fixes. Review the errors and fix them before retrying.

---

## Next Steps

- [Commit Conventions](./03-commit-conventions.md) - Understand the commit format these commands use
- [PR Guidelines](./02-pr-guidelines.md) - Review expectations for pull requests
- [Development Workflow](../00-getting-started/04-development-workflow.md) - Full development process
