import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMethodComponent } from './login-method.component';

describe('LoginMethodComponent', () => {
  let component: LoginMethodComponent;
  let fixture: ComponentFixture<LoginMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
