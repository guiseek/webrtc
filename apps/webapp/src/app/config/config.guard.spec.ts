import { TestBed } from '@angular/core/testing';

import { ConfigGuard } from './config.guard';

describe('ConfigGuard', () => {
  let guard: ConfigGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfigGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
