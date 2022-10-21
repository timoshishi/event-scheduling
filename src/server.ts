import path from 'path';
import swaggerUI, { JsonObject } from 'swagger-ui-express';
import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { addControllerRoutes } from './router';
import { Server } from 'http';
import { getYamlSchema, openApiErrorHandler, openApiValidator } from './utils/server-utils';

class ExpressServer {
  openApiPath: string;
  schema: JsonObject;
  app: Express;
  server: Server | null;
  constructor(private port: number, openApiYaml: string) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    this.server = null;
    this.schema = getYamlSchema(openApiYaml);

    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('dev'));
    }
    // Canary endpoint
    this.app.get('/hello', (_: Request, res: Response) => res.send(`Hello World. path: ${this.openApiPath}`));

    // Copy of the api yml if you're interested
    this.app.get('/openapi', (_: Request, res: Response) => res.sendFile(path.join(__dirname, 'api.yml')));

    // Swagger UI documentation available at http://localhost:{PORT}/api-docs
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));

    // Code Coverage
    this.app.use('/coverage', express.static(path.join(__dirname, '..', 'coverage', 'lcov-report')));

    // Validate requests and responses against the OpenAPI spec
    openApiValidator(this.app, this.openApiPath);

    // Add all the routes from the controllers;
    addControllerRoutes(this.app);

    // Handle OpenAPI validation errors
    openApiErrorHandler(this.app);
  }

  launch() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }

  async close() {
    if (this.server) {
      this.server.close();
    }
  }
}

export const server = new ExpressServer(3000, path.join(__dirname, 'api.yml'));
