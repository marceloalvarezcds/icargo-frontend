import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ChoferService } from './chofer.service';

describe('ChoferService', () => {
  let service: ChoferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChoferService],
    });
    service = TestBed.inject(ChoferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
