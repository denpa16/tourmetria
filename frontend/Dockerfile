FROM node:12.16-alpine
COPY /package* /app/
WORKDIR /app
RUN apk add --no-cache --virtual build-deps make gcc g++ py-pip && npm i && apk del --no-cache build-deps
COPY / /app/
RUN chmod +x entrypoint.production.sh
RUN npm run build
