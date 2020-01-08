import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileInfoMobileComponent } from './user-profile-info-mobile.component';

describe('UserProfileInfoMobileComponent', () => {
  let component: UserProfileInfoMobileComponent;
  let fixture: ComponentFixture<UserProfileInfoMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileInfoMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileInfoMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
