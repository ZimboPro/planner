import { Component, OnInit } from '@angular/core';
import { Schedule } from '@planner/shared/models/schedule';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  schedule: Schedule;
  constructor() { }

  ngOnInit() {
  }

  random() {
    this.schedule.entries.push(
      {
        label: 'Drink',
        color: '#eee',
        desc: 'Drink water',
        monday: {
          times: [
            {start: new Date(), done: false}
          ]
        }
      }
    )
  }

}
