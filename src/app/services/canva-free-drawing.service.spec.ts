import { TestBed } from '@angular/core/testing';

import { CanvaFreeDrawingService } from './canva-free-drawing.service';

describe('CanvaFreeDrawingService', () => {
  let service: CanvaFreeDrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvaFreeDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
