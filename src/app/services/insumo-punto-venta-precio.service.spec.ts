import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InsumoPuntoVentaPrecioService } from './insumo-punto-venta-precio.service';

describe('InsumoPuntoVentaPrecioService', () => {
  let service: InsumoPuntoVentaPrecioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InsumoPuntoVentaPrecioService],
    });
    service = TestBed.inject(InsumoPuntoVentaPrecioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
