FROM node:14.15.4-alpine

#Dependencies
RUN apk add --virtual .build-deps python make g++ gcc

#Dependencies for RadioX Bot
RUN apk add --virtual .radiox-deps ffmpeg

WORKDIR /usr/src/app

COPY / /usr/src/app/

RUN npm install

CMD [ "npm", "start" ]
