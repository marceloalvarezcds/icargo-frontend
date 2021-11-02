import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RemitenteService } from './remitente.service';

describe('RemitenteService', () => {
  let service: RemitenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RemitenteService],
    });
    service = TestBed.inject(RemitenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
