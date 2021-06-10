import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ElectronService } from 'ngx-electron';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConvertToCalendarEvents, ConvertToDbCalendarEvent } from 'src/assets/models/dbCalendarEvent';
import { ToDo } from '../../../assets/models/ToDo';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private electronService: ElectronService
  ) {}

  getEvents(): Observable<CalendarEvent[]> {
    return of(this.electronService.ipcRenderer.sendSync('get'))
      .pipe(map(x  => {
        return ConvertToCalendarEvents(x);
      }), catchError(err => throwError(err.json)));
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent[]> {
    return of(this.electronService.ipcRenderer.sendSync('add', ConvertToDbCalendarEvent(event)))
      .pipe(map(x  => {
        const t: CalendarEvent[] = [];
        return ConvertToCalendarEvents(x);
      }), catchError(err => throwError(err.json)));
  }

  deleteEvent(event: CalendarEvent): Observable<CalendarEvent[]> {
    return of(this.electronService.ipcRenderer.sendSync('delete', ConvertToDbCalendarEvent(event)))
      .pipe(map(x  => {
        return ConvertToCalendarEvents(x);
      }),catchError(err => throwError(err.json)));
  }

  getTodo(): Observable<ToDo[]> {
    return of(this.electronService.ipcRenderer.sendSync('get-todo'))
      .pipe(catchError(err => throwError(err.json)));
  }

  addTodo(event: ToDo): Observable<ToDo[]> {
    return of(this.electronService.ipcRenderer.sendSync('add-todo', event))
      .pipe(catchError(err => throwError(err.json)));
  }

  deleteTodo(event: ToDo): Observable<ToDo[]> {
    return of(this.electronService.ipcRenderer.sendSync('delete-todo', event))
      .pipe(catchError(err => throwError(err.json)));
  }
}
