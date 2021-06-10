
import { CalendarEvent } from 'angular-calendar';
import { getDay, getMinutes, getHours, setDay, setHours, setMinutes, startOfMinute } from 'date-fns';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DbCalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;
  // 0 is Sunday
  @Column()
  dayOfWeek: number;
  @Column()
  startHour: number;
  @Column()
  startMinute: number;
  @Column()
  endHour: number;
  @Column()
  endMinute: number;
  @Column()
  title: string;
  @Column()
  colour: string;
}

export function ConvertToCalendarEvent(event: DbCalendarEvent): CalendarEvent {
  return {
    id: event.id,
    start: setDateTime(event.dayOfWeek, event.startHour, event.startMinute),
    end: setDateTime(event.dayOfWeek, event.endHour, event.endMinute),
    title: event.title,
    color: {
      primary: '#000000',
      secondary: event.colour
    }
  };
}

function setDateTime(dayOfWeek: number, hour: number, min: number) {
  return  startOfMinute(setMinutes(setHours(setDay(new Date(), dayOfWeek), hour), min));
}

export function ConvertToCalendarEvents(event: DbCalendarEvent[]): CalendarEvent[] {
  const temp: CalendarEvent[] = [];
  for (let index = 0; index < event.length; index++) {
    const element = event[index];
    temp.push(ConvertToCalendarEvent(element));
  }
  return temp;
}


export function ConvertToDbCalendarEvent(event: CalendarEvent): DbCalendarEvent {
  return {
    id: event.id as number,
    dayOfWeek: getDay(event.start),
    startHour: getHours(event.start),
    startMinute: getMinutes(event.start),
    endHour: getHours(event.end),
    endMinute: getMinutes(event.end),
    title: event.title,
    colour: event.color.secondary
  };
}

export function ConvertToDbCalendarEvents(event: CalendarEvent[]): DbCalendarEvent[] {
  const temp: DbCalendarEvent[] = [];
  for (let index = 0; index < event.length; index++) {
    const element = event[index];
    temp.push(ConvertToDbCalendarEvent(element));
  }
  return temp;
}
