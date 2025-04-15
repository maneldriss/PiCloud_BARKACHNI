import { TestBed } from '@angular/core/testing';

import { OutfitRecommendationService } from './outfit-recommendation.service';

describe('OutfitRecommendationService', () => {
  let service: OutfitRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutfitRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
