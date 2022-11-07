export interface Event {
  id: number;
  eventName: string;
  eventStart: string;
  eventEnd: string;
}

export enum ModalView {
  'EDIT' = 'EDIT',
  'CREATE' = 'CREATE',
}
