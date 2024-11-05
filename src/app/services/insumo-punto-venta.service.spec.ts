import { TestBed } from '@angular/core/testing';

import { InsumoPuntoVentaService } from './insumo-punto-venta.service';

describe('InsumoPuntoVentaService', () => {
  let service: InsumoPuntoVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsumoPuntoVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
