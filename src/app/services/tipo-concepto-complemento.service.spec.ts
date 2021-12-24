import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoConceptoComplementoService } from './tipo-concepto-complemento.service';

describe('TipoConceptoComplementoService', () => {
  let service: TipoConceptoComplementoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoConceptoComplementoService],
    });
    service = TestBed.inject(TipoConceptoComplementoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
