import { TestBed } from '@angular/core/testing';

import { CanDeactivateFormService } from './can-deactivate-form.service';

describe('CanDeactivateFormService', () => {
  let service: CanDeactivateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanDeactivateFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
