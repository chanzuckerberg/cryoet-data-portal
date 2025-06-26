# Create Pull Request Command

This command automates the creation of pull requests from existing commits. It should be used after running `/create-commits` to create logical commits.

## Command Usage

- `create-pr` - Basic usage with current branch (merges to main)
- `create-pr --draft` - Create PR in draft mode
- `create-pr --issue 123` - Link PR to issue #123
- `create-pr --base develop` - Create PR with custom base branch
- `create-pr --draft --issue 123` - Combine draft and issue flags
- `create-pr --base feature-abc --draft --issue 123` - Full example with all flags

### Flag Details

- `--base <branch-name>` - Specify the base branch to merge into (default: main)
  - Useful for creating PRs against feature branches or when working with dependent branches
  - Helps create cleaner diffs by avoiding commits from unrelated features
- `--draft` - Create PR in draft mode
- `--issue <number>` - Link PR to issue number

## Prerequisites

This command expects that `/create-commits` has been run first to create logical commits. The workflow will:

1. Verify that the current branch has commits to push
2. Check if commits exist that haven't been pushed to remote
3. Proceed with PR creation if commits are available

## Workflow

### 1. Branch and Commit Validation

- Check current branch name using `git branch --show-current`
- Determine base branch (default: `main`, or value from `--base` flag)
- Validate base branch exists: `git show-ref --verify refs/heads/<base-branch>` or `git ls-remote --heads origin <base-branch>`
- Verify current branch is different from base branch
- Check for unpushed commits using `git log origin/<current-branch>..HEAD` or `git rev-list --count @{u}..HEAD`
- If no unpushed commits exist, inform user and exit

### 2. Branch Push and PR Creation

- Check if branch exists on remote: `git ls-remote --heads origin <branch-name>`
- If branch doesn't exist on remote OR has unpushed commits, push: `git push -u origin <branch-name>`
- Analyze existing commit messages to determine primary scope and generate PR title
- Create PR body with:
  - **Summary**: Brief overview of changes made (derived from commit messages)
  - **Changes**: Bullet list of major modifications (from commit history)
  - **Testing**: Instructions for testing the changes
  - **Issue Link**: If `--issue` flag provided, add "Closes #<number>"

#### PR Title Generation:

- Analyze commit messages from `git log <base-branch>..HEAD --oneline`
- Extract primary scope from most recent or most significant commit
- Use format: `<primary-scope>: <concise-description>`
- Example: `feat: add dataset metadata display functionality`

#### PR Creation Command:

```bash
gh pr create \
  --title "<scope>: <title>" \
  --body "<generated-body>" \
  $(if draft flag: --draft) \
  --head <branch-name> \
  --base <base-branch>
```

Where `<base-branch>` is determined by:
- Value from `--base` flag if provided
- Default to `main` if no `--base` flag specified

## Error Handling

### No Commits to Push:

- If current branch has no unpushed commits, inform user to run `/create-commits` first
- Exit gracefully with instructions

### Git Conflicts:

- If branch is behind base branch, suggest rebasing first: `git rebase origin/<base-branch>`
- If conflicts exist, pause and request manual resolution

### Base Branch Validation:

- If specified base branch doesn't exist locally or remotely, list available branches and exit
- If current branch is the same as base branch, inform user they need to create commits on a feature branch first
- If base branch is not accessible, suggest fetching: `git fetch origin <base-branch>`

### Push Failures:

- If push fails due to authentication issues, provide GitHub CLI setup instructions
- If push is rejected due to branch protection rules, inform user and suggest draft PR creation

## Success Confirmation

After successful PR creation:

1. Display PR URL
2. Show commit summary with messages (from git log)
3. Confirm if created as draft (if applicable)
4. Show linked issue number (if applicable)
5. Display instructions for next steps (review process, testing, etc.)

## Advanced Features

### PR Body Generation:

- Parse commit messages to extract meaningful summary
- Group related commits to describe feature scope
- Include testing instructions based on changed files

### Base Branch Validation Requirements:

1. **Branch Existence Check**: Verify base branch exists using `git show-ref --verify refs/heads/<base-branch>` (local) or `git ls-remote --heads origin <base-branch>` (remote)
2. **Branch Accessibility**: Ensure base branch is up-to-date with remote: `git fetch origin <base-branch>`
3. **Self-Reference Prevention**: Prevent creating PR where current branch equals base branch
4. **Branch Relationship Validation**: Check if current branch has diverged from base branch using `git merge-base <base-branch> HEAD`

## Workflow Summary

1. **Validate Prerequisites**: Ensure commits exist and branch is ready for PR
2. **Push Branch**: Push to origin only if necessary (new branch or unpushed commits)
3. **Generate PR Content**: Create title and body from existing commit history
4. **Create PR**: Use GitHub CLI to create pull request with proper flags
5. **Confirm Success**: Display PR details and next steps
