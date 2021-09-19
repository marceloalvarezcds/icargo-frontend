import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BackendTestService } from './backend-test.service';

describe('BackendTestService', () => {
  let service: BackendTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendTestService],
    });
    service = TestBed.inject(BackendTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
