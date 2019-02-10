import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMenuComponent } from './e-menu.component';

describe('EMenuComponent', () => {
  let component: EMenuComponent;
  let fixture: ComponentFixture<EMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
