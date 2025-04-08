import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationFormComponent } from './donation-form.component';

describe('DonationFormComponent', () => {
  let component: DonationFormComponent;
  let fixture: ComponentFixture<DonationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationFormComponent]
    });
    fixture = TestBed.createComponent(DonationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
