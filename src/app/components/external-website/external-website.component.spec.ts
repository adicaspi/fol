import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalWebsiteComponent } from './external-website.component';

describe('ExternalWebsiteComponent', () => {
  let component: ExternalWebsiteComponent;
  let fixture: ComponentFixture<ExternalWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
