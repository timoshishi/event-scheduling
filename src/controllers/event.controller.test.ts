import { seedEvent, seedUsers, initDb, seedUser, seedParticipant, seedEventHost, seedDb } from '../utils/test-utils';
import { Event, EventParticipant } from '@prisma/client';
import request from 'supertest';
import { server } from '../server';
import { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { EventReturn } from '../types';
const BASE_ENDPOINT = '/events';

describe('events', () => {
  beforeAll(() => {
    return initDb();
  });

  beforeAll(() => {
    return seedUsers(10);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    return initDb();
  });

  const earlierDate = new Date('2021-01-01').toISOString();
  const laterDate = new Date('2022-01-02').toISOString();

  jest.spyOn(console, 'error').mockImplementation(() => {});

  describe('/', () => {
    describe('POST - createEvent', () => {
      it('POST should create a new event and return the entire object', async () => {
        let eventNameInput = 'test event';
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          eventName: eventNameInput,
          eventStart: earlierDate,
          eventEnd: laterDate,
        });
        const { createdAt, updatedAt, eventName, id, eventStart, eventEnd } = res.body.data;
        expect(res.statusCode).toEqual(201);
        expect(new Date(createdAt)).toBeInstanceOf(Date);
        expect(new Date(updatedAt)).toBeInstanceOf(Date);
        expect(typeof id).toBe('number');
        expect(eventNameInput).toBe(eventName);
        expect(eventStart).toBe(earlierDate);
        expect(eventEnd).toBe(laterDate);
      });

      it('POST should return 400 if the start date is greater than the end date', async () => {
        let eventName = 'test event';
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          eventName,
          eventStart: laterDate,
          eventEnd: earlierDate,
        });
        expect(res.statusCode).toEqual(400);
      });

      it('POST should return 400 if the start and end date are the same', async () => {
        let eventName = 'test event';
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          eventName,
          eventStart: earlierDate,
          eventEnd: earlierDate,
        });
        expect(res.statusCode).toEqual(400);
      });

      it('POST should have a host property of null', async () => {
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          eventName: 'test event',
          eventStart: earlierDate,
          eventEnd: laterDate,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.hostId).toBeNull();
      });
    });
    describe('GET - getEvents', () => {
      beforeEach(() => {
        return initDb();
      });
      beforeEach(() => {
        return seedDb();
      });
      afterAll(() => {
        return initDb();
      });
      it('GET should return an array of events', async () => {
        const res = await request(server.app).get(BASE_ENDPOINT);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThanOrEqual(10);
        const [event] = res.body.data;
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('eventName');
        expect(event).toHaveProperty('eventStart');
        expect(event).toHaveProperty('eventEnd');
        expect(typeof event.eventEnd).toBe('string');
        expect(event).toHaveProperty('createdAt');
        expect(event).toHaveProperty('updatedAt');
      });

      it('GET should not have a user or participants key if no params are passed in', async () => {
        const res = await request(server.app).get(BASE_ENDPOINT);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThanOrEqual(10);
        const [event] = res.body.data;
        expect(event).not.toHaveProperty('user');
        expect(event).not.toHaveProperty('participants');
      });

      it('GET should return all the events if no params are passed in', async () => {
        const res = await request(server.app).get(BASE_ENDPOINT);
        const allEvents = await prisma.event.findMany();
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data).toHaveLength(allEvents.length);
      });

      it('GET should return the event with the host if a host exists and include=host', async () => {
        await initDb();
        const event = await seedEvent();
        const host = await seedUser();
        await seedEventHost(event.id, host.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}?include=host`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        const foundEvent = res.body.data.filter(({ id }: { id: number }) => id === event.id)[0];
        expect(foundEvent).toHaveProperty('host');
        expect(foundEvent.host).toHaveProperty('id');
      });

      it('GET should return an array of participants if include=participants', async () => {
        await initDb();
        const event = await seedEvent();
        const user = await seedUser();
        await seedParticipant(event.id, user.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}?include=participants`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        const [eventWithParticipants] = res.body.data;
        expect(eventWithParticipants).toHaveProperty('participants');
        expect(eventWithParticipants.participants).toBeInstanceOf(Array);
        expect(eventWithParticipants.participants.length).toBeGreaterThanOrEqual(1);
        expect(eventWithParticipants.participants[0]).toHaveProperty('id');
      });

      it('GET should return only events with the hostId if a hosts userId is passed in', async () => {
        await initDb();
        const event = await seedEvent();
        await seedEvent();
        await seedEvent();
        const host = await seedUser();
        await seedEventHost(event.id, host.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}?hostId=${host.id}&include=host`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        expect(res.body.data.every((event: EventReturn) => event.host.id === host.id)).toBe(true);
        const [eventWithHost] = res.body.data;
        expect(eventWithHost).toHaveProperty('host');
        expect(eventWithHost.host).toHaveProperty('id');
        expect(eventWithHost.host.id).toBe(host.id);
      });

      it('GET should return only events with the participantUserId if a participants userId is passed in', async () => {
        await initDb();
        const event1 = await seedEvent();
        await seedEvent();
        await seedEvent();
        const event4 = await seedEvent();
        const userParticipant = await seedUser();
        const user2 = await seedUser();
        await seedParticipant(event1.id, user2.id);
        await seedParticipant(event1.id, userParticipant.id);
        await seedParticipant(event4.id, userParticipant.id);
        const res = await request(server.app).get(
          `${BASE_ENDPOINT}?participantUserId=${userParticipant.id}&include=participants`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        const events = res.body.data;
        expect(events.every((event: EventReturn) => event.participants.length)).toBe(true);
        expect(events).toHaveLength(2);
        const [eventWithParticipants] = events;
        expect(eventWithParticipants).toHaveProperty('participants');
        expect(eventWithParticipants.participants).toBeInstanceOf(Array);
        expect(eventWithParticipants.participants.length).toBeGreaterThanOrEqual(1);
        expect(eventWithParticipants.participants[0]).toHaveProperty('id');
      });

      it('GET should only get events with an eventStart in the query greater than or equal to the start date passed in', async () => {
        await initDb();
        const event1 = await seedEvent();
        const event2 = await seedEvent();
        const event3 = await seedEvent();
        const event4 = await seedEvent();
        const event5 = await seedEvent();
        // get the event with the latest start date
        const latestStartEvent = [event1, event2, event3, event4, event5].sort((a, b) => {
          return new Date(b.eventStart).getTime() - new Date(a.eventStart).getTime();
        })[0];
        const res = await request(server.app).get(
          `${BASE_ENDPOINT}?eventStart=${encodeURIComponent(
            latestStartEvent.eventStart.toISOString()
          )}&include=participants`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
        const events = res.body.data;
        expect(events).toHaveLength(1);
      });

      it('GET should return an empty array if the eventStart is greater than the eventEnd', async () => {
        await initDb();
        await seedEvent();
        await seedEvent();
        await seedEvent();
        await seedEvent();
        await seedEvent();

        const res = await request(server.app).get(
          `${BASE_ENDPOINT}?eventStart=${encodeURIComponent(laterDate)}&eventEnd=${encodeURIComponent(earlierDate)}`
        );
        expect(res.statusCode).toEqual(400);
        expect(res.body.data).toBeInstanceOf(Array);
        const events = res.body.data;
        expect(events).toHaveLength(0);
      });
    });
  });

  describe('[/:id]', () => {
    describe('GET - getEvent', () => {
      it('GET should return a single event', async () => {
        const res = await request(server.app).post(BASE_ENDPOINT).send({
          eventName: 'test event',
          eventStart: earlierDate,
          eventEnd: laterDate,
        });
        const { id } = res.body.data;
        const getRes = await request(server.app).get(`${BASE_ENDPOINT}/${id}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body.data).toMatchObject(res.body.data);
      });

      it('GET should return data property of null and 404 status if the event does not exist', async () => {
        const res = await request(server.app).get(`${BASE_ENDPOINT}/100000`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.data).toBeNull();
      });

      it('GET should include the host if there is a host and the include query param is set to host', async () => {
        const host = await seedUser();
        const event = await seedEvent();
        const eventHost = await seedEventHost(event.id, host.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}/${event.id}?include=host`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.hostId).toBe(host.id);
        expect(res.body.data.host.id).toBe(host.id);
        expect(res.body.data.host.name).toBe(host.name);
      });

      it('GET should include the participants if there are participants and the include query param is set to participants', async () => {
        const user = await seedUser();
        const event = await seedEvent();
        const participant = await seedParticipant(event.id, user.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}/${event.id}?include=participants`);
        expect(res.statusCode).toEqual(200);
        const resEvent = res.body.data;

        expect(resEvent.participants.length).toBe(1);
        expect(resEvent.participants[0].userId).toBe(user.id);
        expect(resEvent.participants[0].user.name).toBe(user.name);
      });

      it('GET should include the participants and the host if there are participants and the include query param is set to participants and host', async () => {
        const host = await seedUser();
        const user = await seedUser();
        const user2 = await seedUser();
        const event = await seedEvent();
        const eventHost = await seedEventHost(event.id, host.id);
        const participant = await seedParticipant(event.id, user.id);
        const participant2 = await seedParticipant(event.id, user2.id);
        const res = await request(server.app).get(`${BASE_ENDPOINT}/${event.id}?include=participants&include=host`);
        expect(res.statusCode).toEqual(200);
        const resEvent = res.body.data;

        expect(resEvent.participants.length).toBe(2);
        expect(resEvent.participants[0].userId).toBe(user.id);
        expect(resEvent.participants[0].user.name).toBe(user.name);
        expect(resEvent.participants[1].userId).toBe(user2.id);
        expect(resEvent.participants[1].user.name).toBe(user2.name);
        expect(resEvent.hostId).toBe(host.id);
        expect(resEvent.host.id).toBe(host.id);
        expect(resEvent.host.name).toBe(host.name);
      });
    });

    describe('PUT - updateEvent', () => {
      it('PUT should update an event and return the entire object', async () => {
        const res = await seedEvent();
        const { id } = res;
        const updatedEventName = 'updated event name';
        const updatedEventStart = new Date('2021-01-03').toISOString();
        const updatedEventEnd = new Date('2021-01-04').toISOString();
        const putRes = await request(server.app).put(`${BASE_ENDPOINT}/${id}`).send({
          eventName: updatedEventName,
          eventStart: updatedEventStart,
          eventEnd: updatedEventEnd,
        });
        expect(putRes.statusCode).toEqual(200);
        expect(putRes.body.data.eventName).toBe(updatedEventName);
        expect(putRes.body.data.eventStart).toBe(updatedEventStart);
        expect(putRes.body.data.eventEnd).toBe(updatedEventEnd);
      });

      it('PUT should return 400 if the start date is greater than the end date', async () => {
        const res = await seedEvent();
        const { id } = res;
        const updatedEventName = 'updated event name';
        const updatedEventStart = new Date('2021-01-03').toISOString();
        const updatedEventEnd = new Date('2021-01-02').toISOString();
        const putRes = await request(server.app).put(`${BASE_ENDPOINT}/${id}`).send({
          eventName: updatedEventName,
          eventStart: updatedEventStart,
          eventEnd: updatedEventEnd,
        });
        expect(putRes.statusCode).toEqual(400);
      });

      it('PUT should return 400 if the start and end date are the same', async () => {
        const res = await seedEvent();
        const { id } = res;
        const updatedEventName = 'updated event name';
        const updatedEventStart = new Date('2021-01-03').toISOString();
        const updatedEventEnd = new Date('2021-01-03').toISOString();

        const putRes = await request(server.app).put(`${BASE_ENDPOINT}/${id}`).send({
          eventName: updatedEventName,
          eventStart: updatedEventStart,

          eventEnd: updatedEventEnd,
        });
        expect(putRes.statusCode).toEqual(400);
      });

      it('PUT should return 404 if the event does not exist', async () => {
        const res = await request(server.app).put(`${BASE_ENDPOINT}/100000`).send({
          eventName: 'updated event name',
          eventStart: earlierDate,
          eventEnd: laterDate,
        });
        expect(res.statusCode).toEqual(404);
      });
    });

    describe('DELETE - deleteEvent', () => {
      it('DELETE should delete an event and return the entire object', async () => {
        const res = await seedEvent();
        const { id } = res;
        const deleteRes = await request(server.app).delete(`${BASE_ENDPOINT}/${id}`);
        expect(deleteRes.statusCode).toEqual(204);
      });

      it('DELETE should return 404 if the event does not exist', async () => {
        const res = await request(server.app).delete(`${BASE_ENDPOINT}/100000`);
        expect(res.statusCode).toEqual(404);
      });

      it('DELETE should remove all connected participants from the eventParticipant table', async () => {
        const event = await seedEvent();
        const user1 = await seedUser();
        const user2 = await seedUser();
        const participant1 = await seedParticipant(event.id, user1.id);
        const participant2 = await seedParticipant(event.id, user2.id);
        const eventWithParticipants = await prisma.event.findFirst({
          where: {
            id: event.id,
          },
          include: {
            participants: true,
          },
        });
        expect(eventWithParticipants?.participants.length).toBe(2);
        const deleteRes = await request(server.app).delete(`${BASE_ENDPOINT}/${event.id}`);
        expect(deleteRes.statusCode).toEqual(204);
        const participants = await prisma.eventParticipant.findMany({
          where: {
            id: {
              in: [participant1.id, participant2.id],
            },
          },
        });
        expect(participants.length).toBe(0);
      });
    });
  });

  describe('/:eventId/hosts', () => {
    describe('DELETE - removeHostFromEvent', () => {
      it('DELETE returns 404 if the event does not exist', async () => {
        const res = await request(server.app).delete(`${BASE_ENDPOINT}/100000/hosts`);
        expect(res.statusCode).toEqual(404);
      });

      it('DELETE removes the host from the event', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const event1Res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser.id}`
        );
        expect(event1Res.statusCode).toEqual(200);
        expect(event1Res.body.data.hostId).toEqual(insertedUser.id);
        const res = await request(server.app).delete(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts`);
        expect(res.statusCode).toEqual(204);
      });

      it('DELETE does not remove the host from the users table', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const event1Res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser.id}`
        );
        expect(event1Res.statusCode).toEqual(200);
        expect(event1Res.body.data.hostId).toEqual(insertedUser.id);
        const res = await request(server.app).delete(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts`);
        expect(res.statusCode).toEqual(204);
        const user = await prisma.user.findFirst({
          where: {
            id: insertedUser.id,
          },
        });
        expect(user).not.toBeNull();
      });
    });

    describe('PUT - addHostToEvent', () => {
      it('PUT returns the original event with the new host', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser.id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.hostId).toEqual(insertedUser.id);
        expect(res.body.data.eventName).toEqual(insertedEvent.eventName);
      });

      it('PUT replaces the host if the host already exists', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const insertedUser2: User = await seedUser();
        const event1Res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser.id}`
        );
        expect(event1Res.statusCode).toEqual(200);
        expect(event1Res.body.data.hostId).toEqual(insertedUser.id);
        const res = await request(server.app).put(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser2.id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.hostId).toEqual(insertedUser2.id);
        expect(res.body.data.eventName).toEqual(insertedEvent.eventName);
      });

      it('PUT only updates the host', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts/${insertedUser.id}`)
          .send({
            eventName: 'updated event name',
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.hostId).toEqual(insertedUser.id);
        expect(res.body.data.eventName).toEqual(insertedEvent.eventName);
      });

      it('PUT returns 404 if the event does not exist', async () => {
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(`${BASE_ENDPOINT}/100000/hosts/${insertedUser.id}`);
        expect(res.statusCode).toEqual(404);
      });

      it('PUT returns 404 if the user does not exist', async () => {
        const insertedEvent = await seedEvent();
        const res = await request(server.app).put(`${BASE_ENDPOINT}/${insertedEvent.id}/hosts/100000`);
        expect(res.statusCode).toEqual(404);
      });
    });
  });

  describe('/:eventId/participants/:participantUserId', () => {
    describe('PUT - addParticipantToEvent', () => {
      it('PUT it creates a record if one does not exist', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.userId).toEqual(insertedUser.id);
        expect(res.body.data.eventId).toEqual(insertedEvent.id);
      });

      it('PUT returns only updates the participant', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`)
          .send({
            eventName: 'updated event name',
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.userId).toEqual(insertedUser.id);
        expect(res.body.data.eventId).toEqual(insertedEvent.id);
      });

      it('PUT has a default value of willAttend as false', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.willAttend).toEqual(false);
      });

      it('PUT returns 404 if the event does not exist', async () => {
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(`${BASE_ENDPOINT}/100000/participants/${insertedUser.id}`);
        expect(res.statusCode).toEqual(404);
      });

      it('PUT accepts a value of attendanceRequired in the body', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`)
          .send({
            attendanceRequired: true,
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.attendanceRequired).toEqual(true);
      });

      it('PUT has a default value of attendanceRequired: false in the response', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.attendanceRequired).toEqual(false);
      });

      it('PUT updates the record if it already exists', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const event1Res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );
        expect(event1Res.statusCode).toEqual(200);
        expect(event1Res.body.data.userId).toEqual(insertedUser.id);
        const res = await request(server.app).put(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.attendanceRequired).toEqual(false);
        const res2 = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`)
          .send({
            attendanceRequired: true,
          });
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.data.attendanceRequired).toEqual(true);
      });

      it('PUT responds with a 404 if the user does not exist', async () => {
        const insertedEvent = await seedEvent();
        const res = await request(server.app).put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/100000`);
        expect(res.statusCode).toEqual(404);
      });
    });

    describe('DELETE - removeParticipantFromEvent', () => {
      it('DELETE removes the participant from the event', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        await request(server.app).put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`);
        const deleteResponse = await request(server.app).delete(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}`
        );
        expect(deleteResponse.statusCode).toEqual(204);
      });

      it('DELETE returns 404 if the participant does not exist', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const participant = await seedParticipant(insertedEvent.id, insertedUser.id);
        const deleteResponse = await request(server.app).delete(
          `${BASE_ENDPOINT}/${insertedEvent.id}/participants/213213213`
        );
        expect(deleteResponse.statusCode).toEqual(404);
      });

      it('DELETE returns 404 if the event does not exist', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const participant = await seedParticipant(insertedEvent.id, insertedUser.id);
        const deleteResponse = await request(server.app).delete(
          `${BASE_ENDPOINT}/100000/participants/${insertedUser.id}`
        );
        expect(deleteResponse.statusCode).toEqual(404);
      });
    });
  });

  describe('/:eventId/participants/:participantUserId/status', () => {
    describe('PUT - updateParticipantAttendance', () => {
      it('PUT changes to status of willAttend to true if it is set to true in the body', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const insertedParticipant = await seedParticipant(insertedEvent.id, insertedUser.id);
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}/status`)
          .send({
            willAttend: true,
          });
        expect(res.statusCode).toEqual(204);
        expect(insertedParticipant.willAttend).toEqual(false);
        const updatedParticipant = await prisma.eventParticipant.findUnique({
          where: {
            id: insertedParticipant.id,
          },
        });
        expect(updatedParticipant?.willAttend).toEqual(true);
      });

      it('PUT can change the status of will attend from true to false', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const insertedParticipant = await seedParticipant(insertedEvent.id, insertedUser.id);
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}/status`)
          .send({
            willAttend: true,
          });
        expect(res.statusCode).toEqual(204);
        expect(insertedParticipant.willAttend).toEqual(false);
        const updatedParticipant = await prisma.eventParticipant.findUnique({
          where: {
            id: insertedParticipant.id,
          },
        });
        expect(updatedParticipant?.willAttend).toEqual(true);

        const res2 = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}/status`)
          .send({
            willAttend: false,
          });
        expect(res2.statusCode).toEqual(204);
        const updatedParticipant2 = await prisma.eventParticipant.findUnique({
          where: {
            id: insertedParticipant.id,
          },
        });
        expect(updatedParticipant2?.willAttend).toEqual(false);
      });

      it('PUT returns 400 if an no body is send in', async () => {
        const insertedEvent = await seedEvent();
        const insertedUser: User = await seedUser();
        const insertedParticipant = await seedParticipant(insertedEvent.id, insertedUser.id);
        const res = await request(server.app)
          .put(`${BASE_ENDPOINT}/${insertedEvent.id}/participants/${insertedUser.id}/status`)
          .send();
        expect(res.statusCode).toEqual(400);
      });
    });
  });
});
