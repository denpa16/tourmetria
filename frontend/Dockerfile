ARG PACKAGES_IMAGE
FROM ${PACKAGES_IMAGE:-npm_packages} AS BUILDER

FROM node:16.19-alpine

ARG IMGPROXY_SITE_HOST
ENV IMGPROXY_SITE_HOST=$IMGPROXY_SITE_HOST
ARG UI_DEMO
ENV UI_DEMO=$UI_DEMO

WORKDIR /app
COPY --from=BUILDER /app/node_modules /app/node_modules/
COPY / /app/
RUN chmod +x entrypoint.production.sh
RUN npm run build
