import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DressingFormComponent } from './dressing-form.component';

describe('DressingFormComponent', () => {
  let component: DressingFormComponent;
  let fixture: ComponentFixture<DressingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DressingFormComponent]
    });
    fixture = TestBed.createComponent(DressingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
