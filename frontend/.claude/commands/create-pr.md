# Create Pull Request Command

This command automates the creation of pull requests with intelligent commit splitting, code quality validation, and proper branch management.

## Command Usage

- `create-pr` - Basic usage with current branch
- `create-pr --draft` - Create PR in draft mode
- `create-pr --issue 123` - Link PR to issue #123
- `create-pr --draft --issue 123` - Combine both flags

## Workflow

### 1. Branch Management

- Check current branch name using `git branch --show-current`
- If current branch is `main`:
  - Analyze staged and unstaged changes to determine scope
  - Create new branch with format: `<scope>/auto-<timestamp>-<short-description>`
  - Example: `feat/auto-20250625-dataset-metadata-updates`
- If current branch is not `main`:
  - Use existing branch for PR creation
  - Verify branch is not behind remote main

### 2. Pre-Commit Validation

Execute the following commands in sequence and stop if any fail:

- Run `pnpm lint` to check for linting issues
- If linting fails, run `pnpm lint:fix` to auto-fix issues
- Run `pnpm data-portal type-check` to verify TypeScript types
- If type check fails, report specific errors and require manual fixes before proceeding

### 3. Change Analysis and Commit Splitting

Analyze all staged and unstaged changes to intelligently group them:

#### File Grouping Logic:

- **UI Components**: Group `*.tsx` files in `/components/` together
- **GraphQL Operations**: Group `*.server.ts` files in `/graphql/` together
- **Type Definitions**: Group `__generated_v2__/**/*.ts` files together
- **Translations**: Group `translation.json` changes separately
- **Configuration**: Group config files (`*.config.*`, `package.json`, etc.) together
- **Tests**: Group test files (`*.test.*`, `*.spec.*`) together
- **Documentation**: Group `*.md` files together

#### Commit Creation Strategy:

1. **Single Logical Changes**: Each commit should represent one cohesive change
2. **Component-Based Grouping**: Changes to a component and its related files go together
3. **Feature Boundaries**: Don't mix different features in the same commit
4. **Dependency Order**: Commit dependencies (types, GraphQL) before dependents (components)

### 4. Commit Message Generation

For each commit group, generate messages using this format: `<scope>: <description>`

#### Scope Selection Rules:

- `feat`: New features, components, or major functionality additions
- `fix`: Bug fixes, error corrections, or issue resolutions
- `refactor`: Code restructuring without functional changes
- `style`: CSS, styling, or visual updates
- `docs`: Documentation updates or README changes
- `test`: Adding or updating tests
- `chore`: Maintenance, dependencies, or tooling updates
- `perf`: Performance improvements
- `build`: Build system or deployment changes
- `ci`: Continuous integration configuration

#### Description Guidelines:

- Use present tense ("add" not "added")
- Keep under 50 characters for the title
- Be specific about what changed
- Examples:
  - `feat: add dataset metadata display table`
  - `fix: resolve GraphQL type generation errors`
  - `refactor: extract reusable metadata components`

### 5. Commit Execution

For each commit group:

1. Stage only the files belonging to that group using `git add <files>`
2. Create commit with generated message
3. Verify commit was created successfully
4. Continue to next group

### 6. Branch Push and PR Creation

- Push branch to remote: `git push -u origin <branch-name>`
- Generate PR title using the primary scope from commits
- Create PR body with:
  - **Summary**: Brief overview of changes made
  - **Changes**: Bullet list of major modifications
  - **Testing**: Instructions for testing the changes
  - **Issue Link**: If `--issue` flag provided, add "Closes #<number>"

#### PR Title Format:

`<primary-scope>: <concise-description>`

#### PR Creation Command:

```bash
gh pr create \
  --title "<scope>: <title>" \
  --body "<generated-body>" \
  $(if draft flag: --draft) \
  --head <branch-name> \
  --base main
```

## Error Handling

### Lint Failures:

- Attempt auto-fix with `pnpm lint:fix`
- If still failing, list specific errors and pause for manual resolution

### Type Check Failures:

- Display TypeScript errors clearly
- Require manual fixes before proceeding
- Suggest running `pnpm data-portal build:codegen` if GraphQL types are stale

### Git Conflicts:

- If branch is behind main, suggest rebasing first
- If conflicts exist, pause and request manual resolution

### Empty Changes:

- If no staged or unstaged changes exist, inform user and exit gracefully

## Success Confirmation

After successful PR creation:

1. Display PR URL
2. Show commit summary with messages
3. Confirm if created as draft (if applicable)
4. Show linked issue number (if applicable)

## Advanced Features

### Commit Message Enhancement:

- Analyze file diffs to understand the nature of changes
- Include relevant component names or feature areas

### Quality Gates:

- Ensure all commits have proper conventional format
- Verify no sensitive information is being committed
- Check that commit messages are descriptive and meaningful
