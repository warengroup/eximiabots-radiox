FROM node:14.17.1-alpine

#Dependencies
RUN apk add --virtual .build-deps python make g++ gcc git

#Code Dependencies
RUN apk add --virtual .code-deps ffmpeg

WORKDIR /usr/src/app

COPY / /usr/src/app/

RUN npm install

CMD [ "npm", "start" ]
