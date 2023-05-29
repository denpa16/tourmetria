FROM node:16.16-alpine

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY /package* /app/

RUN npm install && npm cache clean --force

COPY . .

RUN chmod +x entrypoint.production.sh
RUN npm run build
