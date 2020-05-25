import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUserFeedComponent } from './main-user-feed.component';

describe('MainUserFeedComponent', () => {
  let component: MainUserFeedComponent;
  let fixture: ComponentFixture<MainUserFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainUserFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainUserFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
