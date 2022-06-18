
# FROM node:18-alpine3.15 as builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

FROM node:18-alpine3.15

WORKDIR /app

COPY package*.json ./
COPY ormconfig.js ./

RUN npm install --omit=dev

COPY ./dist ./dist

CMD node dist/app.js