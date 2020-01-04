import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileInfoDesktopComponent } from './user-profile-info-desktop.component';

describe('UserProfileInfoDesktopComponent', () => {
  let component: UserProfileInfoDesktopComponent;
  let fixture: ComponentFixture<UserProfileInfoDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileInfoDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileInfoDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
