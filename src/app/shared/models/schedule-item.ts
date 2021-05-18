export interface ScheduleItem {
  label: string;
  desc: string;
  color: string;
  monday?: Day;
  tuesday?: Day;
  wednesday?: Day;
  thursday?: Day;
  friday?: Day;
  saturday?: Day;
  sunday?: Day;
}

export interface Day {
  times: Times[];
}

export interface Times {
  start: Date;
  end?: Date;
  done: boolean;
}
