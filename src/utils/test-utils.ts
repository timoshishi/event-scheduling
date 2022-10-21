import prisma from '../lib/prisma';
import { faker } from '@faker-js/faker';
import { EventParticipant, Event, User } from '@prisma/client';

export const invokeAsyncFunctionNTimes = async <T = any>(n: number, fn: Function, ...args: any): Promise<T | null> => {
  try {
    const promises = new Array(n).fill(0).map((_) => fn(...args));
    const results: any = await Promise.all(promises);
    return results as T;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const seedUser = async () => {
  return prisma.user.create({
    data: {
      name: faker.name.fullName(),
    },
  });
};

export const seedUsers = async (n: number) => {
  return invokeAsyncFunctionNTimes(n, seedUser);
};

export const seedEvent = async () => {
  const event = prisma.event.create({
    data: {
      eventName: faker.company.bsBuzz(),
      eventStart: faker.date.past(),
      eventEnd: faker.date.future(),
    },
  });
  return event;
};

export const seedEvents = async (n: number): Promise<Event[] | null> => {
  return await invokeAsyncFunctionNTimes<Event[]>(n, seedEvent);
};

export const seedParticipant = async (eventId: number, participantUserId: number) => {
  const participant = prisma.eventParticipant.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId: participantUserId,
      },
    },
    create: {
      eventId,
      userId: participantUserId,
    },
    update: { attendanceRequired: faker.datatype.boolean() },
  });
  return participant;
};

export const seedParticipants = async (n: number, events: number[][]) => {
  const promises = events.map((event) => {
    return invokeAsyncFunctionNTimes<EventParticipant>(n, seedParticipant, event[0], event[1]);
  });

  return await Promise.all(promises.flat());
};

export const seedEventHost = async (eventId: number, hostId: number) => {
  try {
    const user = await prisma.event.update({
      where: { id: eventId },
      include: { host: true },
      data: {
        hostId,
      },
    });
    return user;
  } catch (error) {}
};

export const seedEventHosts = async (n: number, events: [number, number][]) => {
  const promises = events.map(([eventId, hostId]) => {
    return seedEventHost(eventId, hostId);
  });
  return await Promise.all(promises.flat());
};

export const deleteAllUsers = async () => {
  await prisma.user.deleteMany();
};

export const deleteAllEvents = async () => {
  await prisma.event.deleteMany();
};

export const deleteAllParticipants = async () => {
  await prisma.eventParticipant.deleteMany();
};

export const initDb = async () => {
  try {
    await deleteAllEvents();
    await deleteAllParticipants();
    await deleteAllUsers();
  } catch (err) {}
};

export const seedDb = async () => {
  try {
    await initDb();
    const users: User[] = await seedUsers(20);
    const events = (await seedEvents(10)) as unknown as Event[];
    const userEventIds = users?.slice(0, 10).map((user, i) => [Number(events[i].id), Number(user.id)]) || [];
    const userEventIds2 = users?.slice(10, 20).map((user, i) => [Number(events[i].id), Number(user.id)]) || [];
    let hosts: any[] = [];
    let participants: any[] = [];
    if (userEventIds[0]?.length) {
      participants =
        (await seedParticipants(10, [...userEventIds, ...userEventIds2])) || ([] as unknown as EventParticipant[]);
      hosts =
        (await seedEventHosts(8, userEventIds.sort((a, b) => Math.random() * 0.5) as [number, number][])).filter(
          Boolean
        ) || ([] as unknown as Event[]);
    }
    if (process.env.NODE_ENV !== 'test') {
      console.log('Database seeded');
    }
    const seedResults = { users, events, participants, hosts } as {
      users: User[];
      events: Event[];
      participants: EventParticipant[];
      hosts: Event[];
    };
    return seedResults;
  } catch (error) {}
};
