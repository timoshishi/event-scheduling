# Event scheduling application

## Overview

A server for a rudimentary event schedule service written in Typescript

The following features have been implemented:

- CRUD users
- CRUD events
- CRUD event attendees
- CRUD event hosts
  - The get endpoint for events allows query parameters for filtering by date range, event ID, participants of the
    event, and the hosts of the event

### Libraries

- [express](https://expressjs.com/)

- [prisma](https://www.prisma.io/)

- [ts-jest](https://kulshekhar.github.io/ts-jest/)

- [supertest](https://github.com/visionmedia/supertest)

- [jest](https://jestjs.io/)

#### API Validation

- [OpenAPI 3.0](https://swagger.io/specification/)

- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

### Server

The server is written in Typescript and uses Express for routing and Prisma for queries.

### Database

The database is a local sqlite db located in the `db` folder.

### Schema Design

The schema has three tables User, EventParticipant and Event.

It is designed to allow for the following features:

- Users can be hosts of multiple events
- Users can be attendees of multiple events
- Events can only have 1 host
- Events can have multiple attendees

Database migrations are handled by Prisma.

The schema design results in a maximum of 2 joins to get all the data for an event.

## Getting Started

### Prerequisites

- node
- npm or yarn

### Installing

- From the base directory run `yarn install` or `npm install`

### Running the server

- run `yarn start` or `npm run start`

### Running the server in development mode

- run `yarn dev` or `npm run dev`

Once you have the server running you will be access API documentation, test coverage reports and the API in the links
provided in the following sections.

### Running with Docker Compose

Pre-requisites:

- Docker
- Docker Compose

#### Starting the application

1. Run `docker compose build -d`

2. Run `docker compose up -d`

#### Stopping the application

1. Run `docker compose down`

The server is available locally at port 3000 and the client at 8080

#### Stop the container

- Get container ID `docker ps`

- Stop container `docker stop <container id>`

### [Deploying to AWS ECR](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html)

- Don't forget to delete the image from ecr when you're done so you don't get charged for storage

`aws ecr delete-repository --repository-name hello-repository --region region --force`

### Running the tests

- run `yarn test` or `npm run test`
- Running this command will reseed the database with new data

## API Documentation and Usage

### [Swagger documentation served on localhost](http://localhost:3000/api-docs)

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
