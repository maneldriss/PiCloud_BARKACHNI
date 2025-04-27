import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfitSwiperComponent } from './outfit-swiper.component';

describe('OutfitSwiperComponent', () => {
  let component: OutfitSwiperComponent;
  let fixture: ComponentFixture<OutfitSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutfitSwiperComponent]
    });
    fixture = TestBed.createComponent(OutfitSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
