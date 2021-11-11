import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PuntoVentaService } from './punto-venta.service';

describe('PuntoVentaService', () => {
  let service: PuntoVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PuntoVentaService],
    });
    service = TestBed.inject(PuntoVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
