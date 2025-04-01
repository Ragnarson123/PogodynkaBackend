# Stage 1: Install dependencies
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run db:deploy && npm run dev"]