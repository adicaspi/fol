import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFollowListComponent } from './view-follow-list.component';

describe('ViewFollowListComponent', () => {
  let component: ViewFollowListComponent;
  let fixture: ComponentFixture<ViewFollowListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFollowListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFollowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
