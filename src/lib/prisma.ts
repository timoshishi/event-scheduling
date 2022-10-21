import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient;

const prisma = (): PrismaClient => {
  if (!_prisma) {
    _prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  return _prisma;
};
export default prisma();
