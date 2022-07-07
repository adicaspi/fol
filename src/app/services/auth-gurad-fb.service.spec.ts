import { TestBed } from '@angular/core/testing';

import { AuthGuradFbService } from './auth-gurad-fb.service';

describe('AuthGuradFbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuradFbService = TestBed.get(AuthGuradFbService);
    expect(service).toBeTruthy();
  });
});
