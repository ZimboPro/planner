import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { SubBaseDirective } from '@planner/shared/directives/sub-base.directive';
import { EventsService } from '@planner/shared/services/events.service';
import { addMinutes } from 'date-fns';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent extends SubBaseDirective implements OnInit {
  @Input() selectedDate: Date;
  eventForm: FormGroup;
  minDate: Date;

  constructor(
    private events: EventsService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.eventForm.get('start').setValue(this.selectedDate);
    this.eventForm.get('end').setValue( addMinutes(this.selectedDate, 5));
    this.eventForm.updateValueAndValidity();
  }

  createForm() {
    this.eventForm = new FormGroup({
      start: new FormControl('', Validators.required),
      end: new FormControl(''),
      title: new FormControl('', Validators.required),
      color: new FormGroup({
          primary: new FormControl('#000000'),
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
      console.log(event);
      event.color.secondary = `#${event.color.secondary.hex}`;
      this.events.addEvent(event).subscribe(x => {
        this.toastController.create({
          message: 'Saved event',
          duration: 1500
        }).then(toastEl => {
          toastEl.present();
        })
        this.modalController.dismiss(null, 'added');

      }, err => {
        console.log(err);
      })
    }
  }
}
