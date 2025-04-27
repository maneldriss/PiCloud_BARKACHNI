import { TestBed } from '@angular/core/testing';
import {AIOutfitRecommendationService} from "./ai-outfit-recommendation.service";

describe('AiOutfitRecommendationService', () => {
  let service: AIOutfitRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIOutfitRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
