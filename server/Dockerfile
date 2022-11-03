# Smaller image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

RUN ls -la

COPY . .

RUN node -v

RUN pwd

RUN npx prisma generate

#   if there is no scheduling.sqlite file, prisma needs to run a migration
RUN cd ../ && mkdir ./db && chmod 777 db && cd ./server && npx prisma migrate dev --name init && cd ../ && chmod 777 db  && echo "finito" && ls -la || echo "Database already exists"


EXPOSE 3000

CMD ["npm", "start"]

RUN ls -la