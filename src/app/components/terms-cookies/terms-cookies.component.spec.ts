import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsCookiesComponent } from './terms-cookies.component';

describe('TermsCookiesComponent', () => {
  let component: TermsCookiesComponent;
  let fixture: ComponentFixture<TermsCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsCookiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
