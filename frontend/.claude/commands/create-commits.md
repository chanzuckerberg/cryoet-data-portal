# Create Commits Command

This command automates the creation of logical, well-structured commits with intelligent grouping by function and descriptive messages, including code quality validation and proper branch management.

## Command Usage

- `create-commits` - Basic usage with current branch
- `create-commits --base develop` - Create commits with custom base branch reference

### Flag Details

- `--base <branch-name>` - Specify the base branch for reference (default: main)
  - Useful when working with feature branches or dependent branches
  - Helps determine which changes are new since branching from base

## Workflow

### 1. Branch Management

- Check current branch name using `git branch --show-current`
- Determine base branch (default: `main`, or value from `--base` flag)
- Validate base branch exists: `git show-ref --verify refs/heads/<base-branch>` or `git ls-remote --heads origin <base-branch>`
- If current branch is same as base branch:
  - Analyze staged and unstaged changes to determine scope
  - Create new branch with format: `<scope>/auto-<timestamp>-<short-description>`
  - Example: `feat/auto-20250625-dataset-metadata-updates`
- If current branch is different from base branch:
  - Use existing branch for commit creation
  - Verify branch is not behind remote base branch: `git merge-base --is-ancestor origin/<base-branch> HEAD`

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

## Error Handling

### Lint Failures:

- Attempt auto-fix with `pnpm lint:fix`
- If still failing, list specific errors and pause for manual resolution

### Type Check Failures:

- Display TypeScript errors clearly
- Require manual fixes before proceeding
- Suggest running `pnpm data-portal build:codegen` if GraphQL types are stale

### Git Conflicts:

- If branch is behind base branch, suggest rebasing first: `git rebase origin/<base-branch>`
- If conflicts exist, pause and request manual resolution

### Base Branch Validation:

- If specified base branch doesn't exist locally or remotely, list available branches and exit
- If current branch is the same as base branch, require creation of new branch first
- If base branch is not accessible, suggest fetching: `git fetch origin <base-branch>`

### Empty Changes:

- If no staged or unstaged changes exist, inform user and exit gracefully

## Success Confirmation

After successful commit creation:

1. Display summary of commits created with messages
2. Show branch status and commit count
3. Confirm all validation checks passed

## Advanced Features

### Commit Message Enhancement:

- Analyze file diffs to understand the nature of changes
- Include relevant component names or feature areas

### Quality Gates:

- Ensure all commits have proper conventional format
- Verify no sensitive information is being committed
- Check that commit messages are descriptive and meaningful

### Base Branch Validation Requirements:

1. **Branch Existence Check**: Verify base branch exists using `git show-ref --verify refs/heads/<base-branch>` (local) or `git ls-remote --heads origin <base-branch>` (remote)
2. **Branch Accessibility**: Ensure base branch is up-to-date with remote: `git fetch origin <base-branch>`
3. **Self-Reference Prevention**: Prevent creating commits when current branch equals base branch without creating new branch first
4. **Branch Relationship Validation**: Check if current branch has diverged from base branch using `git merge-base <base-branch> HEAD`

## Workflow Summary

1. **Validate Environment**: Check branch status and base branch
2. **Quality Validation**: Run linting and type checking
3. **Analyze Changes**: Group files logically by function and feature
4. **Generate Messages**: Create descriptive conventional commit messages
5. **Execute Commits**: Create commits in logical order with proper staging
6. **Confirm Success**: Validate all commits were created successfully
