/* eslint no-fallthrough: off */
import * as ariDates from 'date-arithmetic';
import { momentLocalizer } from 'react-big-calendar';
const dates = ariDates as any;
export {
  milliseconds,
  seconds,
  minutes,
  hours,
  month,
  startOf,
  endOf,
  add,
  eq,
  neq,
  gte,
  gt,
  lte,
  lt,
  inRange,
  min,
  max,
} from 'date-arithmetic';

const MILLI = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
} as const;
type Localizer = typeof momentLocalizer;
const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function monthsInYear(year: number) {
  let date = new Date(year, 0, 1);

  return MONTHS.map((i) => dates.month(date, i));
}

export function firstVisibleDay(date: Date, localizer: any) {
  let firstOfMonth = dates.startOf(date, 'month');

  return dates.startOf(firstOfMonth, 'week', localizer.startOfWeek());
}

export function lastVisibleDay(date: Date, localizer: any) {
  let endOfMonth = dates.endOf(date, 'month');

  return dates.endOf(endOfMonth, 'week', localizer.startOfWeek());
}

export function visibleDays(date: Date, localizer: any) {
  let current = firstVisibleDay(date, localizer),
    last = lastVisibleDay(date, localizer),
    days = [];

  while (dates.lte(current, last, 'day')) {
    days.push(current);
    current = dates.add(current, 1, 'day');
  }

  return days;
}

export function ceil(date: Date, unit: keyof typeof MILLI) {
  let floor = dates.startOf(date, unit);

  return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit);
}

export function range(start: Date, end: Date, unit = 'day' as keyof typeof MILLI) {
  let current = start,
    days = [];

  while (dates.lte(current, end, unit)) {
    days.push(current);
    current = dates.add(current, 1, unit);
  }

  return days;
}

export function merge(date: Date, time: Date) {
  if (time == null && date == null) return null;

  if (time == null) time = new Date();
  if (date == null) date = new Date();

  date = dates.startOf(date, 'day');
  date = dates.hours(date, dates.hours(time));
  date = dates.minutes(date, dates.minutes(time));
  date = dates.seconds(date, dates.seconds(time));
  return dates.milliseconds(date, dates.milliseconds(time));
}

export function eqTime(dateA: any, dateB: any) {
  return (
    dates.hours(dateA) === dates.hours(dateB) &&
    dates.minutes(dateA) === dates.minutes(dateB) &&
    dates.seconds(dateA) === dates.seconds(dateB)
  );
}

export function isJustDate(date: Date) {
  return (
    dates.hours(date) === 0 && dates.minutes(date) === 0 && dates.seconds(date) === 0 && dates.milliseconds(date) === 0
  );
}

export function duration(start: Date, end: Date, unit: any, firstOfWeek: any) {
  if (unit === 'day') unit = 'date';
  return Math.abs(
    // eslint-disable-next-line import/namespace
    (dates[unit](start, undefined, firstOfWeek) as any) -
      // eslint-disable-next-line import/namespace
      dates[unit](end, undefined, firstOfWeek)
  );
}

export function diff(dateA: Date, dateB: Date, unit: keyof typeof MILLI) {
  if (!unit || unit === ('milliseconds' as any)) return Math.abs(+dateA - +dateB);

  // the .round() handles an edge case
  // with DST where the total won't be exact
  // since one day in the range may be shorter/longer by an hour
  return Math.round(Math.abs(+dates.startOf(dateA, unit) / MILLI[unit] - +dates.startOf(dateB, unit) / MILLI[unit]));
}

export function total(date: any, unit: any) {
  let ms = date.getTime(),
    div = 1;

  switch (unit) {
    case 'week':
      div *= 7;
      break;

    case 'day':
      div *= 24;
      break;

    case 'hours':
      div *= 60;
      break;

    case 'minutes':
      div *= 60;
      break;

    case 'seconds':
      div *= 1000;
      break;
    default:
      break;
  }

  return ms / div;
}

export function week(date: Date | string) {
  var d: any = new Date(date) as any;
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil((((d - Number(new Date(d.getFullYear(), 0, 1))) as any) / 8.64e7 + 1) / 7);
}

export function today() {
  return dates.startOf(new Date(), 'day');
}

export function yesterday() {
  return dates.add(dates.startOf(new Date(), 'day'), -1, 'day');
}

export function tomorrow() {
  return dates.add(dates.startOf(new Date(), 'day'), 1, 'day');
}
