import { useRef } from 'react';
import { Event } from '../types/client.d';
export const DialogContent = ({ event, closeDialog }: { event?: Event; closeDialog: () => void }) => {
  const [eventStart, startTime] = event?.eventStart.split('T') || ['', ''];
  const [eventEnd, endTime] = event?.eventEnd.split('T') || ['', ''];

  const today = new Date();
  const time = today.getHours() + 6 + ':' + today.getMinutes() + ':' + today.getSeconds();
  // const timePlus = today.getHours() + 2 + ':' + today.getMinutes() + ':' + today.getSeconds();

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        opacity: '1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <form
        ref={formRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            eventName: { value: string };
            eventStart: { value: string };
            eventEnd: { value: string };
            eventDescription: { value: string };
            startTime: { value: string };
          };
          const { eventName, eventStart, eventEnd, eventDescription, startTime } = target;
          const submissionValues = {
            eventName: eventName.value,
            eventStart: eventStart.value,
            eventEnd: eventEnd.value,
            startTime: startTime.value,
            eventDescription: eventDescription.value,
            id: event?.id || '',
          };
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div>
            <FormField
              label='Event Name'
              type='text'
              id='event-name'
              name='eventName'
              defaultValue={event?.eventName}
            />
            <FormField
              label='Event Description'
              type='text'
              id='event-description'
              name='eventDescription'
              defaultValue={''}
            />
          </div>
          <div>
            <FormField
              label='Event Start Date'
              type='date'
              id='start-date'
              name='eventStart'
              defaultValue={eventStart}
            />
            <FormField label='Event Start Time' type='time' id='start-time' name='startTime' defaultValue={startTime} />
            <FormField label='Event Start Time' type='time' id='end-time' name='endTime' defaultValue={endTime} />
          </div>
          <div>
            <FormField label='Event End Date' type='date' id='end-date' name='eventEnd' defaultValue={eventEnd} />
          </div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button type='button' style={{ marginLeft: '1rem', marginRight: '1rem' }} onClick={closeDialog}>
            Close
          </button>
          <FormField type='submit' label='Submit' id='submit' name='submit' value='Submit' />
        </div>
      </form>
    </div>
  );
};

const FormField = ({
  label,
  type,
  id,
  name,
  defaultValue,
  value,
  ...props
}: {
  label: string;
  type: string;
  id: string;
  name: string;
  value?: string;
  defaultValue?: any;
}) => (
  <div style={{ marginTop: '0.5rem' }}>
    <label htmlFor={id}>{label}</label>
    <div />
    <input type={type} id={id} name={name} {...props} />
  </div>
);
