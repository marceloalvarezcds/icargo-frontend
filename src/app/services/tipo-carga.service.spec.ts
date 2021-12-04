import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoCargaService } from './tipo-carga.service';

describe('TipoCargaService', () => {
  let service: TipoCargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoCargaService],
    });
    service = TestBed.inject(TipoCargaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
