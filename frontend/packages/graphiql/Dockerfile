FROM node:20.8-alpine as build

COPY . /app

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store npm -g i pnpm && pnpm i --frozen-lockfile

WORKDIR /app/packages/graphiql
RUN pnpm build

FROM nginx:alpine as server

COPY --from=build /app/packages/graphiql/dist /usr/share/nginx/html
