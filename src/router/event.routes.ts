import eventController from '../controllers/event.controller';
import { Controller } from '../types';

export const eventRoutes: Controller[] = [
  {
    path: '/:eventId/hosts/:hostId',
    method: 'put',
    handler: eventController.addHostToEvent,
  },
  {
    path: '/:eventId/hosts',
    method: 'delete',
    handler: eventController.removeHostFromEvent,
  },
  {
    path: '/:eventId/participants/:participantUserId/status',
    method: 'put',
    handler: eventController.updateParticipantAttendance,
  },
  {
    path: '/:eventId/participants/:participantUserId',
    method: 'put',
    handler: eventController.addParticipantToEvent,
  },
  {
    path: '/:eventId/participants/:participantUserId',
    method: 'delete',
    handler: eventController.removeParticipantFromEvent,
  },
  {
    path: '/:id',
    method: 'get',
    handler: eventController.getEvent,
  },
  {
    path: '/:id',
    method: 'put',
    handler: eventController.updateEvent,
  },
  {
    path: '/:id',
    method: 'delete',
    handler: eventController.deleteEvent,
  },
  {
    path: '/',
    method: 'post',
    handler: eventController.createEvent,
  },
  {
    path: '/',
    method: 'get',
    handler: eventController.getEvents,
  },
];
