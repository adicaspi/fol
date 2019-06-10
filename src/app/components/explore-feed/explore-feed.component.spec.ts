import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreFeedComponent } from './explore-feed.component';

describe('ExploreComponent', () => {
  let component: ExploreFeedComponent;
  let fixture: ComponentFixture<ExploreFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExploreFeedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
