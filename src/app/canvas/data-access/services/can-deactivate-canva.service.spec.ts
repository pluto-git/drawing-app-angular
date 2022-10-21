import { TestBed } from '@angular/core/testing';

import { CanDeactivateCanvaService } from './can-deactivate-canva.service';

describe('CanDeactivateCanvaService', () => {
  let service: CanDeactivateCanvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanDeactivateCanvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
