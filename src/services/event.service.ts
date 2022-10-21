import prisma from '../lib/prisma';
import { PrismaClient, EventParticipant, Event } from '@prisma/client';
import { IncludeParam } from '../types';

export class EventService {
  constructor(private prisma: PrismaClient) {}

  /************************/
  /******* Events *********/
  /************************/

  createEvent = async ({
    eventName,
    eventStart,
    eventEnd,
  }: {
    eventName: string;
    eventStart: string;
    eventEnd: string;
  }): Promise<Event> => {
    return this.prisma.event.create({
      data: {
        eventName,
        eventStart,
        eventEnd,
      },
    });
  };

  updateEvent = async ({
    eventId,
    eventName,
    eventStart,
    eventEnd,
  }: {
    eventId: number;
    eventName: string;
    eventStart: string;
    eventEnd: string;
  }): Promise<Event> => {
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        eventName,
        eventStart,
        eventEnd,
      },
    });
  };

  getEvent = async (id: number, include?: IncludeParam): Promise<Event | null> => {
    try {
      const shouldIncludeHost = include?.includes('host');
      const shouldIncludeParticipants = include?.includes('participants');
      const event = await this.prisma.event.findUnique({
        where: { id },
        include: {
          host: !!shouldIncludeHost,
          participants: !!shouldIncludeParticipants ? { include: { user: true } } : false,
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getEvents = async ({
    hostId,
    participantUserId,
    eventStart,
    eventEnd,
    include,
  }: {
    hostId?: number;
    participantUserId?: number;
    eventStart?: Date;
    eventEnd?: Date;
    include?: IncludeParam;
  }) => {
    try {
      const shouldIncludeHost = include?.includes('host');
      const shouldIncludeParticipants = include?.includes('participants');

      const $AND = (() => {
        const and = [];
        if (hostId) and.push({ hostId });
        if (participantUserId) and.push({ participants: { some: { userId: participantUserId } } });
        if (eventStart) and.push({ eventStart: { gte: eventStart } });
        if (eventEnd) and.push({ eventEnd: { lte: eventEnd } });
        return and;
      })();

      const events = await this.prisma.event.findMany({
        include: {
          host: !!shouldIncludeHost,
          participants: !!shouldIncludeParticipants ? { include: { user: true } } : false,
        },
        where: {
          AND: $AND,
        },
        orderBy: {
          id: 'desc',
        },
      });
      return events;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  deleteEvent = async (id: number): Promise<Event | null> => {
    try {
      return this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /***********************/
  /******* Hosts *********/
  /***********************/

  addHostToEvent = async ({ hostId, eventId }: { hostId: number; eventId: number }) => {
    try {
      return this.prisma.event.update({
        where: { id: eventId },
        include: { host: true },
        data: {
          hostId,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  removeHostFromEvent = async (eventId: number) => {
    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        host: {
          disconnect: true,
        },
      },
      include: { host: true },
    });
  };

  updateParticipantAttendance = async ({
    eventId,
    participantUserId,
    willAttend,
  }: {
    eventId: number;
    participantUserId: number;
    willAttend: boolean;
  }): Promise<EventParticipant | null> => {
    return this.prisma.eventParticipant.update({
      where: {
        eventId_userId: {
          eventId,
          userId: participantUserId,
        },
      },
      data: {
        willAttend,
      },
    });
  };

  /******************************/
  /******* Participants *********/
  /******************************/

  addParticipantToEvent = async ({
    participantUserId,
    eventId,
    attendanceRequired = false,
  }: {
    participantUserId: number;
    eventId: number;
    attendanceRequired?: boolean;
  }): Promise<EventParticipant | null> => {
    return this.prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: participantUserId,
        },
      },
      create: {
        attendanceRequired,
        eventId,
        userId: participantUserId,
      },
      update: { attendanceRequired },
    });
  };

  removeParticipantFromEvent = async ({
    participantUserId,
    eventId,
  }: {
    participantUserId: number;
    eventId: number;
  }): Promise<EventParticipant | null> => {
    const data = await this.prisma.eventParticipant.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: participantUserId,
        },
      },
    });
    return data;
  };
}

const eventService = new EventService(prisma);
export default eventService;
