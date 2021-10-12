import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CentroOperativoClasificacionService } from './centro-operativo-clasificacion.service';

describe('CentroOperativoClasificacionService', () => {
  let service: CentroOperativoClasificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CentroOperativoClasificacionService],
    });
    service = TestBed.inject(CentroOperativoClasificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
