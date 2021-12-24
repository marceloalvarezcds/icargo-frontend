import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoConceptoDescuentoService } from './tipo-concepto-descuento.service';

describe('TipoConceptoDescuentoService', () => {
  let service: TipoConceptoDescuentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoConceptoDescuentoService],
    });
    service = TestBed.inject(TipoConceptoDescuentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
