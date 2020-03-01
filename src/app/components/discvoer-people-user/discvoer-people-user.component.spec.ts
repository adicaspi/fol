import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscvoerPeopleUserComponent } from './discvoer-people-user.component';

describe('DiscvoerPeopleUserComponent', () => {
  let component: DiscvoerPeopleUserComponent;
  let fixture: ComponentFixture<DiscvoerPeopleUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscvoerPeopleUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscvoerPeopleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
