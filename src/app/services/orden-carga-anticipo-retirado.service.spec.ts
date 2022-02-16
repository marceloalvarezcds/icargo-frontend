import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaAnticipoRetiradoService } from './orden-carga-anticipo-retirado.service';

describe('OrdenCargaAnticipoRetiradoService', () => {
  let service: OrdenCargaAnticipoRetiradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaAnticipoRetiradoService],
    });
    service = TestBed.inject(OrdenCargaAnticipoRetiradoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
