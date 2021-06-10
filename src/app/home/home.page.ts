import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubBaseDirective } from '@planner/shared/directives/sub-base.directive';
import { Schedule } from '@planner/shared/models/schedule';
import { EventsService } from '@planner/shared/services/events.service';
import { CalendarEvent } from 'angular-calendar';
import { differenceInMinutes, getMinutes, isToday } from 'date-fns';
import { CreateEventComponent } from './create-event/create-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { from } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import getHours from 'date-fns/getHours';
import { NotificationsService } from '@planner/shared/services/notifications.service';


interface IHourEvent {
  date: Date;
  sourceEvent: MouseEvent;
}

interface ICalendarEventOutput {
  event: CalendarEvent;
  sourceEvent: MouseEvent | any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends SubBaseDirective implements OnInit {
  schedule: Schedule;
  events: CalendarEvent[] = [];
  viewDate: Date = new Date();

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private notificationService: NotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    console.log('get events');
    this.eventsService.getEvents().subscribe(x => {
      console.log(x);
      this.events = x;
    });
    from(this.notificationService.areEnabled())
      .pipe(filter(x => x.value === true))
      .pipe(tap(x => this.createNotification()))
      .subscribe(_ => {});
  }

  createNotification() {
    console.log('create');
    const now = new Date();
    this.notificationService.areEnabled()
    this.notificationService.getPending().then(v => {
      for (const event of this.events) {
        if (differenceInMinutes(event.start, now) > 0 && isToday(event.start)) {
          const index = v.notifications.findIndex(x => x.id === event.id);
          if (index === -1 || v.notifications.length === 0) {
              console.log('created');
              this.notificationService.schedule({
                notifications: [{
                id: event.id as number,
                title: `Daily Planner - ${event.title}`,
                body: `${this.getTime(event.start)} - ${this.getTime(event.end)}`,
                schedule: {
                  at: event.start
                },
              }]
            });
          }
        }
      }
    })

  }

  getTime(date: Date) {
    return `${getHours(date)}:${getMinutes(date)}`;
  }


  onEvent(event: ICalendarEventOutput) {
    console.log(event);
    this.modalController.create({
      component: ViewEventComponent,
      componentProps: {
        event: event.event
      }
    }).then(modalEl => {
      modalEl.present();
      modalEl.onDidDismiss().then(val => {
        if (val.role === 'added') {
          this.loadEvents();
        }
      });
    })
  }

  hourClicked(event: IHourEvent) {
    // console.log(event);
    this.modalController.create({
      component: CreateEventComponent,
      componentProps: {
        selectedDate: event.date
      }
    }).then(modalEl => {
      modalEl.present();
      modalEl.onDidDismiss().then(val => {
        if (val.role === 'added') {
          this.loadEvents();
        }
      });
    });
  }

}
