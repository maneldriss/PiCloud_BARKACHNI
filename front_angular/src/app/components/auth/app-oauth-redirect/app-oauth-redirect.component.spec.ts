import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOauthRedirectComponent } from './app-oauth-redirect.component';

describe('AppOauthRedirectComponent', () => {
  let component: AppOauthRedirectComponent;
  let fixture: ComponentFixture<AppOauthRedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppOauthRedirectComponent]
    });
    fixture = TestBed.createComponent(AppOauthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
