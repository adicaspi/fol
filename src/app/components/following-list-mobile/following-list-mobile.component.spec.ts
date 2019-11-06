import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingListMobileComponent } from './following-list-mobile.component';

describe('FollowingListMobileComponent', () => {
  let component: FollowingListMobileComponent;
  let fixture: ComponentFixture<FollowingListMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingListMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingListMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
