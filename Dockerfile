FROM node:13.14.0-alpine

WORKDIR /usr/src/app

COPY / /usr/src/app/

RUN apk add --virtual .build-deps python make g++ gcc

RUN npm install

CMD [ "npm", "start" ]