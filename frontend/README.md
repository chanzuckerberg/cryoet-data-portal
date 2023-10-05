# CryoET Data Portal Frontend Monorepo

This directory contains the entire source code for the CryoET Data Portal Frontend, organized as a monorepo containing several packages that have different responsibilities:

| Package       | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| data-portal   | Main web interface for the data portal.                       |
| eslint-config | Shared eslint config                                          |
| eslint-plugin | Shared eslint plugin for defining custom rules                |
| graphiql      | Web interface for interacting with the data portalGraphQL API |

## Quick Start

### Setup Node.js

It's recommended you use NVM so you don't have to manage multiple Node.js versions yourself:

- Bash: [nvm](https://github.com/nvm-sh/nvm)
- Fish: [nvm.fish](https://github.com/jorgebucaran/nvm.fish)
- Zsh: [zsh-nvm](https://github.com/lukechilds/zsh-nvm)

When you have NVM setup, run the following commands:

```sh
# cd into data portal frontend directory
cd frontend/

# installs Node.js version defined in `.nvmrc`
nvm install

# uses project defined Node.js version
nvm use

# install pnpm globally
npm -g install pnpm

# install project dependencies
pnpm install
```

## Start Dev Servers

The root `package.json` includes scripts for running any or all dev servers on the frontend. The following table lists the command and what dev servers it starts up:

| Command           | Servers         | URL                   |
| ----------------- | --------------- | --------------------- |
| `dev`             | All dev servers | All URLs below        |
| `dev:data-portal` | Data Portal     | http://localhost:8080 |
| `dev:graphiql`    | GraphiQL        | http://localhost:8081 |

## Docker Compose

A docker compose file is provided for convenience in starting up and destroying frontend services during local development:

```sh
# Start all services
docker-compose up

# Start specific service
docker-compose up data-portal

# Start services in background
docker-compose up -d

# Shutdown all services + cleanup images and volumes
docker-compose down --rmi all -v
```
