import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekViewComponent } from './components/week-view/week-view.component';
import { DayViewComponent } from './components/day-view/day-view.component';



@NgModule({
  declarations: [
    WeekViewComponent,
    DayViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WeekViewComponent,
    DayViewComponent
  ]
})
export class SharedModule { }
