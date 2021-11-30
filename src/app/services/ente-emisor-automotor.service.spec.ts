import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EnteEmisorAutomotorService } from './ente-emisor-automotor.service';

describe('EnteEmisorAutomotorService', () => {
  let service: EnteEmisorAutomotorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnteEmisorAutomotorService],
    });
    service = TestBed.inject(EnteEmisorAutomotorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
