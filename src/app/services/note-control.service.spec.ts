import { TestBed } from '@angular/core/testing';

import { NoteControlService } from './note-control.service';

describe('NoteControlService', () => {
  let service: NoteControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
