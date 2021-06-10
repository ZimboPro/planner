import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

import { WeekViewComponent } from './components/week-view/week-view.component';
import { DayViewComponent } from './components/day-view/day-view.component';
import { SubBaseDirective } from './directives/sub-base.directive';



@NgModule({
  declarations: [
    WeekViewComponent,
    DayViewComponent,
    SubBaseDirective
  ],
  imports: [
    CommonModule,
    MatGridListModule
  ],
  exports: [
    WeekViewComponent,
    DayViewComponent
  ]
})
export class SharedModule { }
