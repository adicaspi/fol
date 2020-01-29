import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverPeopleComponent } from './discover-people.component';

describe('DiscoverPeopleComponent', () => {
  let component: DiscoverPeopleComponent;
  let fixture: ComponentFixture<DiscoverPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
