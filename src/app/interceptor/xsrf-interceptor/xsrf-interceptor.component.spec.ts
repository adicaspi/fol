import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XsrfInterceptorComponent } from './xsrf-interceptor.component';

describe('XsrfInterceptorComponent', () => {
  let component: XsrfInterceptorComponent;
  let fixture: ComponentFixture<XsrfInterceptorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XsrfInterceptorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XsrfInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
