import userService, { UserService } from '../services/user.service';
import { RouteHandler } from '../types';
import { responseHandler, errorHandler } from '../utils/server-utils';

export class UserController {
  constructor(private userService: UserService) {}
  createUser: RouteHandler = async (req, res) => {
    try {
      const { name } = req.body;
      const user = await this.userService.createUser(name);
      return responseHandler({ res, data: user, statusCode: 201 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  deleteUser: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(Number(id));
      return res.status(204).send();
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  deleteAllUsers: RouteHandler = async (_, res) => {
    try {
      await this.userService.deleteAllUsers();
      return res.sendStatus(204);
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  getUser: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(Number(id));
      return responseHandler({ res, data: user || null, statusCode: user?.id ? 200 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  getAllUsers: RouteHandler = async (_, res) => {
    try {
      const users = await this.userService.getAllUsers();
      return responseHandler({ res, data: users });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  updateUser: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const user = await this.userService.updateUser(Number(id), name);
      return responseHandler({ res, data: user });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };
}

const userController = new UserController(userService);
export default userController;
