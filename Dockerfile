FROM node:22-alpine

WORKDIR /app


COPY package.json package.json
COPY server.js server.js

RUN npm install 

CMD [ "node", "server.js" ]
EXPOSE 8080
