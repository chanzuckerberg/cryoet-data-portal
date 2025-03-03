FROM node:20.8-alpine as build

COPY ../../.. /app

WORKDIR /app

RUN npm install -g pnpm@8.10.5

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter=./packages/data-portal build

FROM node:20.8-alpine as server

COPY --from=build /app /app

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store npm -g i pnpm@8.10.5 && pnpm prune --prod

WORKDIR /app/packages/data-portal
ENTRYPOINT [ "pnpm", "start" ]
