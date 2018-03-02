FROM node:alpine

ADD ./server/ .
ADD ./dist/ ./dist

ENTRYPOINT ["node", "index.js"]

