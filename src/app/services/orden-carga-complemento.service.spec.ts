import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaComplementoService } from './orden-carga-complemento.service';

describe('OrdenCargaComplementoService', () => {
  let service: OrdenCargaComplementoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaComplementoService],
    });
    service = TestBed.inject(OrdenCargaComplementoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
