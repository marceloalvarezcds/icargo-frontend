import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaAnticipoSaldoService } from './orden-carga-anticipo-saldo.service';

describe('OrdenCargaAnticipoSaldoService', () => {
  let service: OrdenCargaAnticipoSaldoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaAnticipoSaldoService],
    });
    service = TestBed.inject(OrdenCargaAnticipoSaldoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
