import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable, of } from 'rxjs';
import { ToDo } from '../../../assets/models/ToDo';

@Injectable({
  providedIn: 'root'
})
export class DevEventsService {
  private events: CalendarEvent[] = [];
  private toDos: ToDo[] = [];
  constructor() { }

  getEvents(): Observable<CalendarEvent[]> {
    return of ([...this.events]);
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent[]> {
    const index = this.events.findIndex(x => x.id === event.id);
    if (index > -1)
      this.events[index] = event;
    else {
      event.id = this.events.length;
      this.events.push(event);
    }
    return of ([...this.events]);
  }

  deleteEvent(event: CalendarEvent): Observable<CalendarEvent[]> {
    const index = this.events.findIndex(x => x.id === event.id);
    if (index > -1)
      this.events = this.events.splice(index, 1);
    return of ([...this.events]);
  }

  getTodo(): Observable<ToDo[]> {
    return of([...this.toDos]);
  }

  addTodo(event: ToDo): Observable<ToDo[]> {
    const index = this.events.findIndex(x => x.id === event.id);
    if (index > -1)
      this.toDos[index] = event;
    else {
      event.id = this.events.length;
    }
    return of([...this.toDos]);
  }

  deleteTodo(event: ToDo): Observable<ToDo[]> {
    const index = this.events.findIndex(x => x.id === event.id);
    if (index > -1)
      this.events = this.events.splice(index, 1);
    return of([...this.toDos]);
  }
}
