import { TestBed } from '@angular/core/testing';

import { DressingService } from './dressing.service';

describe('DressingService', () => {
  let service: DressingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DressingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
