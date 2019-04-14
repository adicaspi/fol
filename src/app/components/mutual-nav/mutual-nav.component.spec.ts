import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualNavComponent } from './mutual-nav.component';

describe('MutualNavComponent', () => {
  let component: MutualNavComponent;
  let fixture: ComponentFixture<MutualNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
