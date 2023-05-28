ARG PACKAGES_IMAGE
FROM ${PACKAGES_IMAGE:-npm_packages} AS BUILDER

FROM node:14-alpine

ARG DIR
ENV DIR $DIR

ARG SERVER_API_URL
ENV SERVER_API_URL $SERVER_API_URL

RUN apk add --no-cache curl  # для healthcheck
COPY --from=BUILDER /app/node_modules /app/node_modules/
COPY ./ /app
COPY ./$DIR /app/$DIR
COPY package.json package-lock.json entrypoint.production.sh /app/
COPY ./common /app/common
WORKDIR /app

RUN chmod +x entrypoint.production.sh
RUN npm run build
