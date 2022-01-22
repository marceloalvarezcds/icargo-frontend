import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaRemisionDestinoService } from './orden-carga-remision-destino.service';

describe('OrdenCargaRemisionDestinoService', () => {
  let service: OrdenCargaRemisionDestinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaRemisionDestinoService],
    });
    service = TestBed.inject(OrdenCargaRemisionDestinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
