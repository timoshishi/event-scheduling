# Smaller image
FROM node:16-alpine

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install

RUN ls -la

COPY . .

RUN ls -la

RUN node -v

RUN pwd

EXPOSE 8080

CMD ["npm", "start"]

RUN ls -la