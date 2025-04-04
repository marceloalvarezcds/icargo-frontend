import { TestBed } from '@angular/core/testing';

import { MonedaCotizacionService } from './moneda-cotizacion.service';

describe('MonedaCotizacionService', () => {
  let service: MonedaCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonedaCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
