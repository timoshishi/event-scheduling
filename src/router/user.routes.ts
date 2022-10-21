import userController from '../controllers/user.controller';
import { Controller } from '../types';

export const userRoutes: Controller[] = [
  {
    path: '/:id',
    method: 'delete',
    handler: userController.deleteUser,
  },
  {
    path: '/:id',
    method: 'get',
    handler: userController.getUser,
  },
  {
    path: '/:id',
    method: 'put',
    handler: userController.updateUser,
  },
  {
    path: '/',
    method: 'get',
    handler: userController.getAllUsers,
  },
  {
    path: '/',
    method: 'post',
    handler: userController.createUser,
  },
  {
    path: '/',
    method: 'delete',
    handler: userController.deleteAllUsers,
  },
];
