# Smaller image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app/server


COPY package*.json ./

RUN npm install

RUN ls -la

COPY . .

RUN ls -la

RUN node -v

RUN pwd

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]

RUN ls -la