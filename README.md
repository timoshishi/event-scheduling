# Event scheduling application

## Overview

A rudimentary event schedule service written in Typescript

Configured for deployment to AWS ECR with Docker Compose

## Client

**_WIP_**

## Server

The server is written in Typescript and uses Express for routing and Prisma for queries.

### Libraries

- [express](https://expressjs.com/)

- [prisma](https://www.prisma.io/)

- [ts-jest](https://kulshekhar.github.io/ts-jest/)

- [supertest](https://github.com/visionmedia/supertest)

- [jest](https://jestjs.io/)

#### API Validation

- [OpenAPI 3.0](https://swagger.io/specification/)

- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

### Database

The database is a local sqlite db located in the `db` folder.

### Schema Design

The schema has three tables User, EventParticipant and Event.

Database migrations are handled by Prisma.

## Getting Started

### Prerequisites

- node
- npm or yarn

### Installing

- From the base directory run `yarn install` or `npm install`

### Running the application

- run `yarn start` or `npm run start`
- The server is available locally at port 3000

- The client is available locally at port 8080

### Running the application in development mode

- run `yarn dev` or `npm run dev`

Once you have the application running you will be access API documentation, test coverage reports and the API in the
links provided in the following sections.

### Running with Docker Compose

Pre-requisites:

- Docker
- Docker Compose

#### Starting the application

1. Run `docker compose build -d`

2. Run `docker compose up -d`

The server is available locally at port 3000 and the client at 80

#### Stopping the application

1. Run `docker compose down`

### [Deploying to AWS ECR](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html)

- Don't forget to delete the image from ecr when you're done so you don't get charged for storage

`aws ecr delete-repository --repository-name hello-repository --region region --force`

### Running the tests

- run `yarn test` or `npm run test`
- Running this command will reseed the database with new data

## API Documentation and Usage

### [Swagger API documentation served on localhost](http://localhost:3000/api-docs)

The API is fully documented at /api-docs on localhost. The swagger documentation is generated from the OpenAPI 3.0
specification in the `openapi.yaml` file. It should be possible to use the swagger UI to interact with the API.

Note the docs will not let you send in invalid requests so these must be done with curl or postman.

If you run into a cors issue you can import the yml file into a tool like Postman.

Ensure all date-times are encoded as ISO strings when sent to the server or they will be rejected. Example query strings
will all be shown on the documentation page.

## Testing

### [Code Coverage Report on localhost](http://localhost:3000/coverage) is available after running `npm run test:coverage`

Testing was performed with Jest and Supertest.

Global coverage is hovering around 90%

Tests are co-located in the folder structure with the files they are testing.

## Validation

### [OpenAPI 3.0 Schema served on localhost](http://localhost:3000/openapi)

Validation was performed against the OpenAPI 3.0 schema using express middleware.

Some manual validation and error handling was necessary for dates and times.
