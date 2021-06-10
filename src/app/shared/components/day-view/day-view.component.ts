import { Attribute, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { eDay } from '@planner/shared/models/eDay';
import { IDay, Times } from '@planner/shared/models/schedule-item';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Time } from '@planner/shared/models/time';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

interface GridTime extends Times {
  incrementCount: number;
}

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {

  @Input() day: IDay;
  @Input() weekday: eDay;
  @Input() start: Time = new Time({ hour: 5, min: 0 });
  @Input() end: Time = new Time({ hour: 23, min: 0 });
  @Input() increments: number = 5;

  displayLabels: boolean;
  entries: GridTime[] = [];

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  @ViewChild('list') el: ElementRef;

  constructor(@Attribute('label') label: string) {
    this.displayLabels = coerceBooleanProperty(label)
  }

  ngOnInit(): void {
    let times: Times[] = [];
    if (this.day && this.day.times.length > 0) {
      times = this.day.times.sort((a: Times, b: Times) => {
        if (a.start.isLess(b.start))
          return -1;
        if (a.start.isEqual(b.start))
          return 0;
        return 1;
      });
    }


  }

  private generateArray(times: Times[]) {
    if (times.length > 0) {

    } else {
      const diff = this.start.diff(this.end);
      const blocks = diff.toTotalMinutes() / this.increments;
      for (let index = 0; index < blocks; index++) {
        const temp = new Time(this.start);
        temp.addMin(index * this.increments);
        const t: GridTime = {
          color: '#fff',
          done: false,
          label: '',
          start: temp,
          incrementCount: 1
        };
        this.entries.push(t);
      }
    }
  }
}
