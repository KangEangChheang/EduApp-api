FROM node:18.20.5-alpine

WORKDIR /myapp
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
CMD npm run start:dev
