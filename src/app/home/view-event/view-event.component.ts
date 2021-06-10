import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { EventsService } from '@planner/shared/services/events.service';
import { CalendarEvent } from 'angular-calendar';
import { Color, stringInputToObject } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {
  @Input() event: CalendarEvent<any>;
  eventForm: FormGroup;
  minDate: Date;

  constructor(
    private events: EventsService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.eventForm.setValue(this.event);
    this.setColor('secondary');
    this.eventForm.updateValueAndValidity();
  }

  setColor(control: string) {
    const { r, g, b, a } = stringInputToObject(this.event.color[control]);
    this.eventForm.get(`color.${control}`).setValue(new Color(r, g, b, a))
  }

  createForm() {
    this.eventForm = new FormGroup({
      id: new FormControl(''),
      start: new FormControl('', Validators.required),
      end: new FormControl(''),
      title: new FormControl('', Validators.required),
      color: new FormGroup({
          primary: new FormControl(''),
          secondary: new FormControl('', Validators.required)
        })
    });
  }

  onClick() {
    console.log(this.eventForm.value);
  }

  onSave() {
    if (this.eventForm.valid) {
      const event = this.eventForm.getRawValue();
      event.color.secondary = `#${event.color.secondary.hex}`;
      console.log(event);
      this.events.addEvent(event).subscribe(x => {
        this.toastController.create({
          message: 'Updated event',
          duration: 1500
        }).then(toastEl => {
          toastEl.present();
        })
        this.modalController.dismiss(null, 'added');

      }, err => {
        console.log(err);
      });
    }
  }

}
