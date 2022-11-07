import React, { useMemo, useContext } from 'react';
import moment from 'moment';
import { Calendar as BigCalendar, Views, momentLocalizer } from 'react-big-calendar';
import * as dates from './utils/dates';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DialogContext } from './context/DialogContext';

const buttonStyle = {
  color: '#373a3c',
  display: 'inline-block',
  margin: '0',
  textAlign: 'center',
  verticalAlign: 'middle',
  background: 'none',
  backgroundImage: 'none',
  border: '1px solid #ccc',
  padding: '0.375rem 1rem',
  borderRadius: '4px',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
} as unknown as any;

const ColoredDateCellWrapper = ({ children }: { children: React.ReactElement }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  });

export const Calendar = ({
  events,
}: {
  events: {
    eventName: string;
    eventStart: string;
    eventEnd: string;
    id: string;
  }[];
}) => {
  const localizer = useMemo(() => momentLocalizer(moment), []);
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(),
      max: dates.add(dates.endOf(new Date(), 'day'), -1, 'hours'),
      views: Object.keys(Views).map((k) => Views[k as keyof typeof Views]),
    }),
    []
  );

  const { toggleDialog } = useContext(DialogContext);

  return (
    <div
      style={{
        height: '80vh',
        width: '80vw',
      }}
      className='calendar'
    >
      <button className='rbc-toolbar button:hover' style={buttonStyle} onClick={toggleDialog}>
        Add Event
      </button>

      <BigCalendar
        components={components as any}
        defaultDate={defaultDate}
        events={events}
        localizer={localizer}
        max={max}
        showMultiDayTimes
        step={60}
        views={views}
        formats={{ dayFormat: 'ddd', dateFormat: 'D', timeGutterFormat: 'h:mm a' }}
        titleAccessor={(event) => event.eventName}
        startAccessor={(event) => new Date(event.eventStart)}
        endAccessor={(event) => new Date(event.eventEnd)}
      />
    </div>
  );
};
