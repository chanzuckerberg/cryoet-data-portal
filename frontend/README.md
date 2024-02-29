# CryoET Data Portal Frontend Monorepo

This directory contains the entire source code for the CryoET Data Portal Frontend, organized as a monorepo containing several packages that have different responsibilities:

| Package       | Description                                    |
| ------------- | ---------------------------------------------- |
| data-portal   | Main web interface for the data portal.        |
| eslint-config | Shared eslint config                           |
| eslint-plugin | Shared eslint plugin for defining custom rules |

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

## Start Dev Server

The npm script `dev` can be used for starting the data portal dev server:

```sh
pnpm dev
```

## Docker Compose

A docker compose file is provided for convenience in starting up and destroying frontend services during local development:

```
# Start all services
docker-compose up

# Start services in background
docker-compose up -d

# Shutdown all services + cleanup images and volumes
docker-compose down --rmi all -v
```
