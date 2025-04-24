import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedProductsComponent } from './reserved-products.component';

describe('ReservedProductsComponent', () => {
  let component: ReservedProductsComponent;
  let fixture: ComponentFixture<ReservedProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservedProductsComponent]
    });
    fixture = TestBed.createComponent(ReservedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
