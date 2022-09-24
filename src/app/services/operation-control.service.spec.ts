import { TestBed } from '@angular/core/testing';

import { OperationControlService } from './operation-control.service';

describe('OperationControlService', () => {
  let service: OperationControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
