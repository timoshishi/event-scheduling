import { responseHandler, errorHandler, isValidEventDate } from '../utils/server-utils';
import { IncludeParam, RouteHandler } from '../types';
import eventService, { EventService } from '../services/event.service';
import { RequestHandler } from 'express';
import { User } from '@prisma/client';

export class EventController {
  constructor(private eventService: EventService) {}

  /************************/
  /******* Events *********/
  /************************/

  createEvent: RouteHandler = async (req, res) => {
    try {
      const { eventName, eventStart, eventEnd } = req.body;
      // make sure the eventStart are valid dates and that event start is earlier than event end
      if (!isValidEventDate(eventStart, eventEnd)) {
        res.status(400).json({ message: 'Invalid event dates' });
        return;
      }
      const event = await this.eventService.createEvent({
        eventName,
        eventStart,
        eventEnd,
      });
      return responseHandler({ res, data: event, statusCode: 201 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  getEvent: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { include } = req.query;

      const event = await this.eventService.getEvent(Number(id), include);
      return responseHandler({ res, data: event, statusCode: event ? 200 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  getEvents: RouteHandler = async (req, res) => {
    try {
      const { hostId, participantUserId, eventStart, eventEnd, include } = req.query;
      if (!!eventStart && !!eventEnd && !isValidEventDate(eventStart, eventEnd)) {
        responseHandler({ res, data: [], statusCode: 400 });
        return;
      }
      const events = await this.eventService.getEvents({
        hostId: Number(hostId),
        participantUserId: Number(participantUserId),
        eventStart: eventStart,
        eventEnd: eventEnd,
        include: include as IncludeParam,
      });
      return responseHandler({ res, data: events || [], statusCode: 200 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  updateEvent: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { eventName, eventStart, eventEnd } = req.body;
      if (!isValidEventDate(eventStart, eventEnd)) {
        return responseHandler({ res, data: null, statusCode: 400 });
      }
      const event = await this.eventService.updateEvent({
        eventId: Number(id),
        eventName,
        eventStart,
        eventEnd,
      });
      return responseHandler({ res, data: event, statusCode: event ? 200 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  deleteEvent: RouteHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await this.eventService.deleteEvent(Number(id));
      return res.status(204).send();
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  /***********************/
  /******* Hosts *********/
  /***********************/

  addHostToEvent: RequestHandler = async (req, res) => {
    try {
      const { eventId, hostId } = req.params;
      const event = await this.eventService.addHostToEvent({
        eventId: parseInt(eventId),
        hostId: parseInt(hostId),
      });
      return responseHandler({ res, data: event, statusCode: event ? 200 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  removeHostFromEvent: RequestHandler = async (req, res) => {
    try {
      const { eventId } = req.params;
      await this.eventService.removeHostFromEvent(parseInt(eventId));
      return responseHandler({ res, statusCode: 204 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  /******************************/
  /******* Participants *********/
  /******************************/

  addParticipantToEvent: RequestHandler = async (req, res) => {
    try {
      const { eventId, participantUserId } = req.params;
      const { attendanceRequired } = req.body;
      const event = await this.eventService.addParticipantToEvent({
        eventId: parseInt(eventId),
        participantUserId: parseInt(participantUserId),
        attendanceRequired,
      });
      return responseHandler({ res, data: event, statusCode: event ? 200 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  removeParticipantFromEvent: RequestHandler = async (req, res) => {
    try {
      const { eventId, participantUserId } = req.params;
      const data = await this.eventService.removeParticipantFromEvent({
        eventId: parseInt(eventId),
        participantUserId: parseInt(participantUserId),
      });
      return responseHandler({ res, statusCode: data ? 204 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };

  updateParticipantAttendance: RequestHandler = async (req, res) => {
    try {
      const { eventId, participantUserId } = req.params;
      const { willAttend } = req.body;
      const data = await this.eventService.updateParticipantAttendance({
        eventId: parseInt(eventId),
        participantUserId: parseInt(participantUserId),
        willAttend,
      });
      return responseHandler({ res, data: !!data ? data : null, statusCode: data ? 204 : 404 });
    } catch (error) {
      return errorHandler({ res, error });
    }
  };
}
const eventController = new EventController(eventService);
export default eventController;
