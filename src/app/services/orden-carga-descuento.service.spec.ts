import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaDescuentoService } from './orden-carga-descuento.service';

describe('OrdenCargaDescuentoService', () => {
  let service: OrdenCargaDescuentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaDescuentoService],
    });
    service = TestBed.inject(OrdenCargaDescuentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
