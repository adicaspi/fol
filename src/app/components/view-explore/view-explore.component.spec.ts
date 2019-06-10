import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExploreComponent } from './view-explore.component';

describe('ViewExploreComponent', () => {
  let component: ViewExploreComponent;
  let fixture: ComponentFixture<ViewExploreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExploreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
