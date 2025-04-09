import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdListComponent } from './ad-list.component';

describe('AdListComponent', () => {
  let component: AdListComponent;
  let fixture: ComponentFixture<AdListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdListComponent]
    });
    fixture = TestBed.createComponent(AdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
