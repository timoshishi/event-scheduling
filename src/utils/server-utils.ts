import { NextFunction, Request, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { JsonObject } from 'swagger-ui-express';
import { Express } from 'express';
import jsYaml from 'js-yaml';
import fs from 'fs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const responseHandler = ({
  res,
  data,
  statusCode = 200,
}: {
  res: Response;
  data?: any;
  statusCode?: number;
}) => {
  if (!!data || data === null) {
    return res.status(statusCode).json({
      data,
    });
  } else {
    return res.status(statusCode).end();
  }
};

export const errorHandler = ({
  res,
  error,
  errorStatus = 500,
}: {
  error: unknown;
  res: Response;
  errorStatus?: number;
}) => {
  console.error(error);
  if (error instanceof PrismaClientKnownRequestError) {
    const notFoundErrorCodes = {
      P2025: 'P2025',
      P2023: 'P2023',
      P2003: 'P2003',
    } as const;
    if (!!notFoundErrorCodes[error.code as keyof typeof notFoundErrorCodes]) {
      return res.status(404).json({ message: 'Record not found' });
    } else {
      return res.status(errorStatus).json({ message: 'Internal Server Error' });
    }
  }
};

export const isValidEventDate = (eventStart: string, eventEnd: string): boolean => {
  try {
    new Date(eventStart);
    new Date(eventEnd);
  } catch (error) {
    return false;
  }
  return eventEnd > eventStart;
};

export const openApiErrorHandler = (app: Express) => {
  app.use((err: any, _: Request, res: Response, nextFnEnsuresResponse: NextFunction) => {
    res.status(400).json({
      message: 'Invalid request',
    });
    console.error('API ERROR', err);
  });
};

export const openApiValidator = (app: Express, openApiPath: string) => {
  app.use(
    OpenApiValidator.middleware({
      apiSpec: openApiPath,
      validateResponses: true,
      validateRequests: true,
      validateApiSpec: true,
      validateFormats: 'full',
    })
  );
};

export const getYamlSchema = (openApiYaml: string): JsonObject => {
  try {
    return jsYaml.load(fs.readFileSync(openApiYaml, 'utf8')) as JsonObject;
  } catch (e) {
    console.error(e);
    return {} as JsonObject;
  }
};
