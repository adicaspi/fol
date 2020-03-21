import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscoverPeopleGeneralComponent } from './view-discover-people-general.component';

describe('ViewDiscoverPeopleGeneralComponent', () => {
  let component: ViewDiscoverPeopleGeneralComponent;
  let fixture: ComponentFixture<ViewDiscoverPeopleGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscoverPeopleGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscoverPeopleGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
