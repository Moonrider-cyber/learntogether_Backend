FROM node:18.3.0-alpine3.14

# Path: /app
WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node","server.js"]