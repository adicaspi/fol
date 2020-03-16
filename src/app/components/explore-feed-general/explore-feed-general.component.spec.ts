import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreFeedGeneralComponent } from './explore-feed-general.component';

describe('ExploreFeedGeneralComponent', () => {
  let component: ExploreFeedGeneralComponent;
  let fixture: ComponentFixture<ExploreFeedGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreFeedGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreFeedGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
