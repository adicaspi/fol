import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExploreGeneralComponent } from './view-explore-general.component';

describe('ViewExploreGeneralComponent', () => {
  let component: ViewExploreGeneralComponent;
  let fixture: ComponentFixture<ViewExploreGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExploreGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExploreGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
