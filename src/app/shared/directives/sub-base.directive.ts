import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appSubBase]'
})
export class SubBaseDirective implements OnDestroy {
  subs: Subscription[] = []

  ngOnDestroy() {
    for (const sub of this.subs) {
      if (sub)
        sub.unsubscribe();
    }
  }

}
