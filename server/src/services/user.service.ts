import { PrismaClient, EventParticipant, User, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { IncludeParam } from '../types';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  createUser = async (name: string): Promise<User> => {
    return this.prisma.user.create({
      data: {
        name,
      },
    });
  };

  updateUser = async (id: number, name: string): Promise<User> => {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  };

  getUser = async (id: number): Promise<User | null> => {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  };

  getAllUsers = async (): Promise<User[]> => {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  };

  deleteUser = async (id: number): Promise<User | null> => {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  };

  deleteAllUsers = async (): Promise<Prisma.BatchPayload> => {
    return this.prisma.user.deleteMany();
  };
}

const userService = new UserService(prisma);
export default userService;
