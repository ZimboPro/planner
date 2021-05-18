import { Component, Input, OnInit } from '@angular/core';
import { eDay } from '@planner/shared/models/eDay';
import { Schedule } from '@planner/shared/models/schedule';
import { Day } from '@planner/shared/models/schedule-item';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent implements OnInit {
  @Input() schedule: Schedule;
  monday: Day[] = [];
  tuesday: Day[] = [];
  wednesday: Day[] = [];
  thursday: Day[] = [];
  friday: Day[] = [];
  saturday: Day[] = [];
  sunday: Day[] = [];

  eDay = eDay;
  constructor() { }

  ngOnInit(): void {
    for (const entry of this.schedule.entries) {
      this.sort(entry.monday, this.monday);
      this.sort(entry.tuesday, this.tuesday);
      this.sort(entry.wednesday, this.wednesday);
      this.sort(entry.thursday, this.thursday);
      this.sort(entry.friday, this.friday);
      this.sort(entry.saturday, this.saturday);
      this.sort(entry.sunday, this.sunday);
    }
  }

  sort(entry: Day, day: Day[]) {
    if (entry && entry.times.length > 0) {
      day.push(entry);
    }
  }
}
