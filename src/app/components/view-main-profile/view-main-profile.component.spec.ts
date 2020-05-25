import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMainProfileComponent } from './view-main-profile.component';

describe('ViewMainProfileComponent', () => {
  let component: ViewMainProfileComponent;
  let fixture: ComponentFixture<ViewMainProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMainProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMainProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
