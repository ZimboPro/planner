import { Component, Input, OnInit } from '@angular/core';
import { eDay } from '@planner/shared/models/eDay';
import { Day } from '@planner/shared/models/schedule-item';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {

  @Input() day: Day[];
  @Input() weekday: eDay;

  constructor() { }

  ngOnInit(): void {
  }

}
