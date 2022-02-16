import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoInsumoService } from './tipo-insumo.service';

describe('TipoInsumoService', () => {
  let service: TipoInsumoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoInsumoService],
    });
    service = TestBed.inject(TipoInsumoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
