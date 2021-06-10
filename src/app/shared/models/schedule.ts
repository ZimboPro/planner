import { IDay } from './schedule-item';

export interface Schedule {
  monday?: IDay;
  tuesday?: IDay;
  wednesday?: IDay;
  thursday?: IDay;
  friday?: IDay;
  saturday?: IDay;
  sunday?: IDay;
}
