# Local Development Setup

This guide walks through setting up the CryoET Data Portal frontend for local development.

> **Prerequisites**: Ensure you have completed all steps in [Prerequisites](./01-prerequisites.md) before continuing.

## Clone the Repository

```bash
git clone https://github.com/chanzuckerberg/cryoet-data-portal.git
cd cryoet-data-portal/frontend
```

## Activate Node Version

The project uses a specific Node.js version defined in `.nvmrc`:

```bash
nvm use
```

This activates the Node.js version specified in `.nvmrc`.

## Install Dependencies

Install all packages using pnpm:

```bash
pnpm install
```

> **Note**: The project enforces pnpm usage. Running `npm install` or `yarn install` will fail.

## Configure Environment

Create a local environment file from the template:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `API_URL_V2` | GraphQL API endpoint | Production API URL |
| `ENV` | Environment name | `local` |
| `LOCALHOST_PLAUSIBLE_TRACKING` | Enable analytics tracking in local dev | `false` |

The default values in `.env.example` connect to the production API, which is suitable for most local development.

**ENV values**: `local`, `dev`, `staging`, `prod`

## Start Development Server

```bash
pnpm dev
```

This starts three concurrent processes:

1. **GraphQL Codegen** - Watches for query changes and regenerates TypeScript types
2. **Remix Dev Server** - Handles hot reload for React components and routes
3. **TypeScript CSS Modules** - Generates type definitions for CSS modules

Once started, open [http://localhost:8080](http://localhost:8080) in your browser.

## Verify Setup

Your setup is working correctly if:

- The browser displays the CryoET Data Portal homepage
- The terminal shows no errors from the three dev processes
- Navigating to different pages loads data from the API

## Alternative: Docker Setup

For containerized development, use Docker Compose:

```bash
# Start the development environment
docker-compose up

# Run in background
docker-compose up -d

# Stop and clean up
docker-compose down --rmi all -v
```

Docker is useful when you want an isolated environment or need to match the production setup more closely.

## Troubleshooting

### `pnpm: command not found`

Install pnpm globally (check `package.json` engines field for required version):

```bash
npm install -g pnpm@8.10.5
```

### Wrong Node version

Ensure nvm is using the project's Node version:

```bash
nvm use
```

### Port already in use

Another process is using port 8080. Find and stop it:

```bash
# List processes using port 8080
lsof -i :8080

# Kill the process by PID (replace <PID> with actual process ID from above)
kill -9 <PID>

# One-liner: find and kill process on port 8080
lsof -ti :8080 | xargs kill -9
```

> **Tip**: The `-t` flag in `lsof -ti` outputs only the PID, making it easy to pipe to `kill`.

### GraphQL codegen errors

Regenerate types manually:

```bash
pnpm data-portal build:codegen
```

## Next Steps

Continue to [Project Structure](./03-project-structure.md) to understand how the codebase is organized.
