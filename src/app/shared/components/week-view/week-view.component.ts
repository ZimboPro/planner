import { Component, Input, OnInit } from '@angular/core';
import { eDay } from '@planner/shared/models/eDay';
import { Schedule } from '@planner/shared/models/schedule';
import { IDay } from '@planner/shared/models/schedule-item';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent implements OnInit {
  @Input() schedule: Schedule;
  eDay = eDay;
  constructor() { }

  ngOnInit(): void {
  }
}
