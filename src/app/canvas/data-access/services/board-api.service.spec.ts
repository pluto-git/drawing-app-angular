import { TestBed } from '@angular/core/testing';

import { BoardApiService } from './board-api.service';

describe('BoardApiService', () => {
  let service: BoardApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
