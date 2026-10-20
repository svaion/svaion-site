# syntax=docker/dockerfile:1
# svaiontech.com: build the static export in a pinned toolchain, then serve it with nginx.
#   docker compose up --build                                   # serve on http://localhost:8080
#   docker build --target export --output type=local,dest=out . # just the files, for Cloudflare Pages

FROM node:26.8.1-alpine AS build
WORKDIR /site
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Domain rules and copy parity run first: a broken invariant stops the image here.
# nginx applies _headers itself (locations.conf), so its copy of the files leaves the file out.
RUN npm test && npm run build \
 && node tools/docker/nginx-locations.mjs out/_headers > locations.conf \
 && cp -r out www && rm www/_headers

FROM scratch AS export
COPY --from=build /site/out /

FROM nginxinc/nginx-unprivileged:1.30-alpine AS serve
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/locations.conf /etc/nginx/svaion/locations.conf
COPY --from=build /site/www /usr/share/nginx/html
RUN nginx -t
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
