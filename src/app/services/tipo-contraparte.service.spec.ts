import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoContraparteService } from './tipo-contraparte.service';

describe('TipoContraparteService', () => {
  let service: TipoContraparteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoContraparteService],
    });
    service = TestBed.inject(TipoContraparteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
