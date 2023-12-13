FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --production

ENV NODE_ENV="production"

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]