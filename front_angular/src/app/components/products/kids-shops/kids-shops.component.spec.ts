import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsShopsComponent } from './kids-shops.component';

describe('KidsShopsComponent', () => {
  let component: KidsShopsComponent;
  let fixture: ComponentFixture<KidsShopsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsShopsComponent]
    });
    fixture = TestBed.createComponent(KidsShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
