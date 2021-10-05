import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportsService],
    });
    service = TestBed.inject(ReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
