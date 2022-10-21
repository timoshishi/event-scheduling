import { UserService } from '../services/user.service';

export type RouteHandler = (req: Request, res: Response, next?: NextFunction) => void;

export type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Controller = {
  path: string;
  method: Methods;
  handler: RouteHandler;
  middleware?: NextFunction;
};

export type ControllerMap = { [basePath: string]: Controller[] };

export type IncludeParam = ('host' | 'participants')[];

export type EventReturn = Prisma.PromiseReturnType<UserService['getEvents']>;
type IncludeParam = ('host' | 'participants')[];

export interface EventWithUser extends Event {
  host: User;
}
export interface EventWithNullUser extends Event {
  host: null | User;
}
