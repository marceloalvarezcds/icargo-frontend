import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MarcaSemiService } from './marca-semi.service';

describe('MarcaSemiService', () => {
  let service: MarcaSemiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarcaSemiService],
    });
    service = TestBed.inject(MarcaSemiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
