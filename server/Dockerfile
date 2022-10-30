# Smaller image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN ls -la
# Bundle app source
COPY . .

RUN ls -la

RUN node -v
RUN pwd
RUN npm install ts-node

RUN npx prisma generate

EXPOSE 80

CMD ["npm", "start"]

RUN ls -la