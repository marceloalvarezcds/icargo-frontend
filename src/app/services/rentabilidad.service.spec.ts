import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RentabilidadService } from './rentabilidad.service';

describe('RentabilidadService', () => {
  let service: RentabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RentabilidadService],
    });
    service = TestBed.inject(RentabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
