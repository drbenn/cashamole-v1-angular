import { TestBed } from '@angular/core/testing';

import { DashboardColorsService } from './dashboard-colors.service';

describe('DashboardColorsService', () => {
  let service: DashboardColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
