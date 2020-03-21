import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscoverPeopleUserComponent } from './view-discover-people-user.component';

describe('ViewDiscoverPeopleUserComponent', () => {
  let component: ViewDiscoverPeopleUserComponent;
  let fixture: ComponentFixture<ViewDiscoverPeopleUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscoverPeopleUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscoverPeopleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
