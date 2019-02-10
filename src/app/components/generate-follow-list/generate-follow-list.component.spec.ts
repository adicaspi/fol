import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFollowListComponent } from './generate-follow-list.component';

describe('GenerateFollowListComponent', () => {
  let component: GenerateFollowListComponent;
  let fixture: ComponentFixture<GenerateFollowListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateFollowListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateFollowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
