import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardmodalComponent } from './rewardmodal.component';

describe('RewardmodalComponent', () => {
  let component: RewardmodalComponent;
  let fixture: ComponentFixture<RewardmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RewardmodalComponent]
    });
    fixture = TestBed.createComponent(RewardmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
