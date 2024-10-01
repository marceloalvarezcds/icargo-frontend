import { TestBed } from '@angular/core/testing';

import { OrdenCargaEvaluacionesService } from './orden-carga-evaluaciones.service';

describe('OrdenCargaEvaluacionesService', () => {
  let service: OrdenCargaEvaluacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenCargaEvaluacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
