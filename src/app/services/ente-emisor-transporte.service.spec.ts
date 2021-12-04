import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EnteEmisorTransporteService } from './ente-emisor-transporte.service';

describe('EnteEmisorTransporteService', () => {
  let service: EnteEmisorTransporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnteEmisorTransporteService],
    });
    service = TestBed.inject(EnteEmisorTransporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
