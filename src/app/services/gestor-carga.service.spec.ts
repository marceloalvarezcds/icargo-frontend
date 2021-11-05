import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GestorCargaService } from './gestor-carga.service';

describe('GestorCargaService', () => {
  let service: GestorCargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GestorCargaService],
    });
    service = TestBed.inject(GestorCargaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
