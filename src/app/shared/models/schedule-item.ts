import { Time } from "./time";

export interface ScheduleItem {
  label: string;
  desc: string;
  color: string;
  monday?: IDay;
  tuesday?: IDay;
  wednesday?: IDay;
  thursday?: IDay;
  friday?: IDay;
  saturday?: IDay;
  sunday?: IDay;
}

export interface IDay {
  times: Times[];
}

export interface Times {
  start: Time;
  end?: Time;
  label: string;
  desc?: string;
  color: string;
  done: boolean;
}
