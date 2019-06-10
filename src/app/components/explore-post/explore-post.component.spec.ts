import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePostComponent } from './explore-post.component';

describe('ExplorePostComponent', () => {
  let component: ExplorePostComponent;
  let fixture: ComponentFixture<ExplorePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
