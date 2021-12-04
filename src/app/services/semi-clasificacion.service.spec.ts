import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SemiClasificacionService } from './semi-clasificacion.service';

describe('SemiClasificacionService', () => {
  let service: SemiClasificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SemiClasificacionService],
    });
    service = TestBed.inject(SemiClasificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
