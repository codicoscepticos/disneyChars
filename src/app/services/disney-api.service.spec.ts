import { TestBed } from '@angular/core/testing';

import { DisneyAPIService } from './disney-api.service';

describe('DisneyAPIService', () => {
  let service: DisneyAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisneyAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
