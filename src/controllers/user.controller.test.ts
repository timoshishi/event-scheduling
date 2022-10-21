import {
  seedUsers,
  initDb,
  deleteAllUsers,
  seedEvent,
  seedUser,
  seedParticipant,
  seedEventHost,
  seedDb,
} from '../utils/test-utils';

import request from 'supertest';
import { server } from '../server';
import prisma from '../lib/prisma';

const BASE_ENDPOINT = '/users';

describe('users', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  beforeAll(() => {
    return initDb();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    return initDb();
  });

  afterAll(async () => {
    return await seedDb();
  });
  describe('/', () => {
    describe('POST - createUser', () => {
      it('POST should create a new user and return the entire object', async () => {
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          name: 'john',
        });
        const { createdAt, updatedAt, name, id } = res.body.data;
        expect(res.statusCode).toEqual(201);
        expect(new Date(createdAt)).toBeInstanceOf(Date);
        expect(new Date(updatedAt)).toBeInstanceOf(Date);
        expect(typeof id).toBe('number');
        expect(name).toBe('john');
      });

      it('POST returns 400 if name is not provided', async () => {
        const res = await request(server.app).post(BASE_ENDPOINT).send({});
        expect(res.statusCode).toEqual(400);
      });
    });

    describe('GET - getAllUsers', () => {
      it('GET should return an empty array if there are no users in the db', async () => {
        await deleteAllUsers();
        const res = await request(server.app).get(BASE_ENDPOINT);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data).toHaveLength(0);
      });

      it('GET should return an array with users array if there is a user in the db', async () => {
        await seedUsers(2);
        const res = await request(server.app).get(BASE_ENDPOINT);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeTruthy();
      });
    });
  });

  describe('[/:id]', () => {
    describe('GET - getUser', () => {
      it('GET should return the user requested', async () => {
        await seedUsers(1);
        const { body } = await request(server.app).get(BASE_ENDPOINT);
        const userToRequest = body.data[0];
        const requestedUser = await request(server.app).get(`${BASE_ENDPOINT}/${userToRequest.id}`);
        expect(requestedUser.body.data).toEqual(userToRequest);
      });

      it('GET should return 404 and a null data property if the user does not exist', async () => {
        const res = await request(server.app).get(`${BASE_ENDPOINT}/112321321321`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.data).toBeNull();
      });
    });

    describe('PUT - updateUser', () => {
      it('PUT should update the user', async () => {
        await seedUsers(1);
        const { body } = await request(server.app).get(BASE_ENDPOINT);
        const userToUpdate = body.data[0];
        const updatedUserResponse = await request(server.app).put(`${BASE_ENDPOINT}/${userToUpdate.id}`).send({
          name: 'Jane',
        });
        const { createdAt, updatedAt, name, id } = updatedUserResponse.body.data;
        expect(createdAt).not.toBe(updatedAt);
        expect(name).toBe('Jane');
      });

      it('PUT should update the user', async () => {
        await seedUsers(1);
        const { body } = await request(server.app).get(BASE_ENDPOINT);
        const userToUpdate = body.data[0];
        const updatedUserResponse = await request(server.app).put(`${BASE_ENDPOINT}/${userToUpdate.id}`).send({
          name: 'Jane',
        });
        const { createdAt, updatedAt, name, id } = updatedUserResponse.body.data;
        expect(createdAt).not.toBe(updatedAt);
        expect(name).toBe('Jane');
      });
    });

    describe('DELETE - deleteUser', () => {
      it('DELETE should delete the user', async () => {
        await seedUsers(1);
        const { body } = await request(server.app).get(BASE_ENDPOINT);
        const userToDelete = body.data[0];
        const deletedUser = await request(server.app).delete(`${BASE_ENDPOINT}/${userToDelete.id}`);
        expect(deletedUser.status).toEqual(204);
      });

      it("DELETE should remove the user's records from the eventParticipant table", async () => {
        const user = await seedUser();
        const event = await seedEvent();
        const participant = await seedParticipant(event.id, user.id);
        const event2 = await seedEvent();
        const participant2 = await seedParticipant(event2.id, user.id);
        // check that the participants are in the db with prisma
        const participantsFromDb = await prisma.eventParticipant.findMany({
          where: {
            id: {
              in: [participant.id, participant2.id],
            },
          },
        });
        expect(participantsFromDb).toHaveLength(2);

        const deletedUser = await request(server.app).delete(`${BASE_ENDPOINT}/${user.id}`);

        expect(deletedUser.status).toEqual(204);
        const remainingParticipants = await prisma.eventParticipant.findMany({
          where: {
            id: {
              in: [participant.id, participant2.id],
            },
          },
        });
        expect(remainingParticipants).toHaveLength(0);
      });

      it('DELETE should update the events where the user was a host and set the hostId to null', async () => {
        const user = await seedUser();
        const event = await seedEvent();
        const event2 = await seedEvent();
        const hostedEvent1 = await seedEventHost(event.id, user.id);
        const hostedEvent2 = await seedEventHost(event2.id, user.id);
        expect(hostedEvent1?.hostId).toBe(user.id);
        expect(hostedEvent2?.hostId).toBe(user.id);
        const deletedUser = await request(server.app).delete(`${BASE_ENDPOINT}/${user.id}`);
        expect(deletedUser.status).toEqual(204);
        const eventsAfterDelete = await prisma.event.findMany({
          where: {
            id: {
              in: [event.id, event2.id],
            },
          },
        });
        expect(eventsAfterDelete[0].hostId).toBeNull();
        expect(eventsAfterDelete[1].hostId).toBeNull();
      });
    });
  });
});
