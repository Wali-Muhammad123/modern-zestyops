# Stage 0, "build-stage", based on Bun, to build and compile the frontend
FROM oven/bun:1 AS build-stage

WORKDIR /app

COPY package.json bun.lock /app/

COPY web-app/package.json /app/web-app/

WORKDIR /app/web-app

RUN bun install

COPY ./web-app /app/web-app
ARG VITE_API_URL

RUN bun run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1

COPY --from=build-stage /app/web-app/dist/ /usr/share/nginx/html

COPY ./web-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./web-app/nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
