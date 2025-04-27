import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AIOutfitBuilderComponent} from "./ai-outfit-builder.component";


describe('AiOutfitBuilderComponent', () => {
  let component: AIOutfitBuilderComponent;
  let fixture: ComponentFixture<AIOutfitBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AIOutfitBuilderComponent]
    });
    fixture = TestBed.createComponent(AIOutfitBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
