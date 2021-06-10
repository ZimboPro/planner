import { TestBed } from '@angular/core/testing';

import { DevEventsService } from './dev-events.service';

describe('DevEventsService', () => {
  let service: DevEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
