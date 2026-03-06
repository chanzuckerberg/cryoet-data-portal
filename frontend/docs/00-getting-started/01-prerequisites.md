# Prerequisites

This document covers the tools and setup required before starting frontend development on the CryoET Data Portal.

## System Requirements

- **Operating System**: macOS, Linux, or Windows with WSL
- **Terminal**: Command-line access required

## Required Tools

| Tool | Purpose |
|------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime (version specified in `.nvmrc`) |
| [pnpm](https://pnpm.io/) | Package manager (version specified in `package.json` engines field) |
| [Git](https://git-scm.com/) | Version control |

## Recommended Tools

### Node Version Manager (NVM)

We recommend using NVM to manage Node.js versions:

- [nvm](https://github.com/nvm-sh/nvm) (Bash)
- [nvm.fish](https://github.com/jorgebucaran/nvm.fish) (Fish)
- [zsh-nvm](https://github.com/lukechilds/zsh-nvm) (Zsh)

Once installed, run the following in the `frontend/` directory:

```bash
cd frontend/
nvm install    # Installs Node version from .nvmrc
nvm use        # Activates the installed version
```

### Docker (Optional)

- [Docker](https://www.docker.com/get-started/) - For Docker Compose development workflow

## IDE Setup

### [VS Code](https://code.visualstudio.com/) (Recommended)

Recommended extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## Verification

```bash
node --version    # Should match version in .nvmrc
pnpm --version    # Should be installed
git --version     # Any recent version
```

## Next Steps

Continue to [Local Development Setup](./02-local-development-setup.md) to set up and run the project.
