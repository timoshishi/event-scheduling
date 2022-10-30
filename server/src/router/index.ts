import { ControllerMap } from '../types';
import { eventRoutes } from './event.routes';
import { userRoutes } from './user.routes';
import { Router as ExpressRouter, Express } from 'express';

export const controllerMap: ControllerMap = {
  '/users': userRoutes,
  '/events': eventRoutes,
};

// Add all routes to the application
export function addControllerRoutes(app: Express) {
  Object.entries(controllerMap).forEach(([basePath, controllers]) => {
    const router = ExpressRouter();

    controllers.forEach((route) => {
      router[route.method](route.path, route.handler);
    });

    app.use(basePath, router);
  });
}
