import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DressingDetailComponent } from './dressing-detail.component';

describe('DressingDetailComponent', () => {
  let component: DressingDetailComponent;
  let fixture: ComponentFixture<DressingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DressingDetailComponent]
    });
    fixture = TestBed.createComponent(DressingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
