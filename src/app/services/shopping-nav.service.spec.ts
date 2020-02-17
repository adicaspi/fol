import { TestBed } from '@angular/core/testing';

import { ShoppingNavService } from './shopping-nav.service';

describe('ShoppingNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingNavService = TestBed.get(ShoppingNavService);
    expect(service).toBeTruthy();
  });
});
