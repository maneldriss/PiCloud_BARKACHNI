import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeBackComponent } from './commande-back.component';

describe('CommandeBackComponent', () => {
  let component: CommandeBackComponent;
  let fixture: ComponentFixture<CommandeBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeBackComponent]
    });
    fixture = TestBed.createComponent(CommandeBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
