import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SemiService } from './semi.service';

describe('SemiService', () => {
  let service: SemiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SemiService],
    });
    service = TestBed.inject(SemiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
