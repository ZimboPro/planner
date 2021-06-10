import { getHours, getMinutes } from "date-fns";

export class Time {

  private _hour: number;
  private _min: number;

  constructor(time?: Date | string | { hour: number, min: number } | Time) {
    if (time) {
      if (typeof(time) === 'string') {

      } else if (time instanceof Date) {
        this._hour = getHours(time);
        this._min = getMinutes(time);
      } else if (time instanceof Time) {
        this._hour = time.getHour();
        this._min = time.getMin();
      } else {
        this._hour = time.hour;
        this._min = time.min;
      }
    } else {
      time = new Date();
      this._hour = getHours(time);
      this._min = getMinutes(time);
    }
  }

  getHour() {
    return this._hour;
  }

  getMin() {
    return this._min;
  }

  setHour(val: number) {
    this._hour = val;
  }

  setMin(val: number) {
    this._min = val;
  }

  diff(compared: Time) {
    const k = Math.abs(this.toTotalMinutes() - compared.toTotalMinutes());
    let hour = Math.floor(k / 60);
    let min = Math.floor(k % 60);
    return new Time({ hour: hour, min: min});
  }

  toTotalMinutes() {
    return this._hour * 60 + this._min;
  }

  toTotalSeconds() {
    return this._min * 3600 + this._min * 60;
  }

  setTotalMinutes(min: number) {
    this._hour = Math.floor(min / 60);
    this._min = Math.floor(min % 60);
  }

  isLess(compared: Time) {
    return this._hour < compared._hour || (this._hour === compared._hour && this._min < compared._min);
  }

  isGreater(compared: Time) {
    return this._hour > compared._hour || (this._hour === compared._hour && this._min > compared._min);
  }

  isLessOrEqual(compared: Time) {
    return this.isLess(compared) || this.isEqual(compared);
  }

  isGreaterOrEqual(compared: Time) {
    return this.isGreater(compared) || this.isEqual(compared);
  }

  isEqual(compared: Time) {
    return this._hour === compared._hour && this._min === compared._min;
  }

  addMin(increment: number) {
    this._min += increment;
    if (this._min >= 60) {
      this.addHour(Math.floor(this._min / 60));
      this._min = this._min % 60;
    }
  }

  addHour(increment: number) {
    this._hour += increment;
    if (this._hour >= 24) {
      this._hour = this._hour % 24;
    }
  }
}
