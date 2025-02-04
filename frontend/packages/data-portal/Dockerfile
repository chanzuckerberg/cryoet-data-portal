FROM node:20.8-alpine as build

COPY . /app

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store npm -g i pnpm@8.10.5 && pnpm i --frozen-lockfile

WORKDIR /app/packages/data-portal
RUN pnpm build

FROM node:20.8-alpine as server

COPY --from=build /app /app

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store npm -g i pnpm@8.10.5 && pnpm prune --prod

WORKDIR /app/packages/data-portal
ENTRYPOINT [ "pnpm", "start" ]
