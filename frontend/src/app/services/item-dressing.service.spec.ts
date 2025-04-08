import { TestBed } from '@angular/core/testing';

import { ItemDressingService } from './item-dressing.service';

describe('ItemDressingService', () => {
  let service: ItemDressingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDressingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
