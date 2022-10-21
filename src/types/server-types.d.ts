declare namespace Components {
  namespace Schemas {
    export interface Error {
      message: string;
    }
    export interface Event {
      name: string;
      tag?: string;
      id: number; // int64
      createdAt?: string;
      updatedAt?: string;
    }
    export interface Faq {
      name: string;
      tag?: string;
      id: number; // int64
    }
    export interface Host {
      name: string;
      tag?: string;
      id: number; // int64
      createdAt?: string;
      updatedAt?: string;
      eventId?: number;
    }
    export interface NewEvent {
      eventName: string;
      eventStart: string;
      eventEnd: string;
    }
    export interface NewFaq {
      name: string;
      tag?: string;
    }
    export interface NewHost {
      name: string;
      eventId: number;
    }
    export interface NewParticipant {
      name: string;
      eventId: number;
      isRequired: boolean;
      willAttend?: boolean;
    }
    export interface NewUser {
      name: string;
    }
    export interface Participant {
      name: string;
      tag?: string;
      id: number; // int64
      createdAt?: string;
      updatedAt?: string;
    }
    export interface User {
      name: string;
      tag?: string;
      id: number; // int64
      createdAt?: string;
      updatedAt?: string;
    }
  }
}
declare namespace Paths {
  namespace AddEvent {
    export type RequestBody = Components.Schemas.NewEvent;
    namespace Responses {
      export type $200 = Components.Schemas.Faq;
      export type Default = Components.Schemas.Error;
    }
  }
  namespace AddHost {
    namespace Parameters {
      export type EventId = number; // int64
      export type HostId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
      hostId: Parameters.HostId /* int64 */;
    }
    namespace Responses {
      export interface $201 {}
      export interface $400 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace AddParticipant {
    namespace Parameters {
      export type EventId = number; // int64
      export type ParticipantId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
      participantId: Parameters.ParticipantId /* int64 */;
    }
    namespace Responses {
      export interface $201 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace AddUser {
    export type RequestBody = Components.Schemas.NewUser;
    namespace Responses {
      export type $200 = Components.Schemas.User;
      export type Default = Components.Schemas.Error;
    }
  }
  namespace DeleteEvent {
    namespace Parameters {
      export type EventId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
    }
    namespace Responses {
      export interface $204 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace DeleteHost {
    namespace Parameters {
      export type EventId = number; // int64
      export type HostId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
      hostId: Parameters.HostId /* int64 */;
    }
    namespace Responses {
      export interface $204 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace DeleteParticipant {
    namespace Parameters {
      export type EventId = number; // int64
      export type ParticipantId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
      participantId: Parameters.ParticipantId /* int64 */;
    }
    namespace Responses {
      export interface $204 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace DeleteUser {
    namespace Parameters {
      export type UserId = number; // int64
    }
    export interface PathParameters {
      userId: Parameters.UserId /* int64 */;
    }
    namespace Responses {
      export interface $204 {}
      export type Default = Components.Schemas.Error;
    }
  }
  namespace FindFaqs {
    namespace Parameters {
      export type DateEnd = string;
      export type DateStart = string;
      export type HostId = number;
      export type ParticipantId = number;
    }
    export interface QueryParameters {
      participantId?: Parameters.ParticipantId;
      hostId?: Parameters.HostId;
      dateStart?: Parameters.DateStart;
      dateEnd?: Parameters.DateEnd;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Event[];
      export type Default = Components.Schemas.Error;
    }
  }
  namespace GetUsers {
    namespace Responses {
      export type $200 = Components.Schemas.User[];
      export type Default = Components.Schemas.Error;
    }
  }
  namespace UpdateEvent {
    namespace Parameters {
      export type EventId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Event;
      export type Default = Components.Schemas.Error;
    }
  }
  namespace UpdateParticipantStatus {
    namespace Parameters {
      export type EventId = number; // int64
      export type ParticipantId = number; // int64
    }
    export interface PathParameters {
      eventId: Parameters.EventId /* int64 */;
      participantId: Parameters.ParticipantId /* int64 */;
    }
    namespace Responses {
      export interface $200 {}
      export type Default = Components.Schemas.Error;
    }
  }
}
