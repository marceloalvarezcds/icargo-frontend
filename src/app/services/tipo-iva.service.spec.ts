import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoIvaService } from './tipo-iva.service';

describe('TipoIvaService', () => {
  let service: TipoIvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoIvaService],
    });
    service = TestBed.inject(TipoIvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
