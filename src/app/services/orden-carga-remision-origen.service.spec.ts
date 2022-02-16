import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaRemisionOrigenService } from './orden-carga-remision-origen.service';

describe('OrdenCargaRemisionOrigenService', () => {
  let service: OrdenCargaRemisionOrigenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaRemisionOrigenService],
    });
    service = TestBed.inject(OrdenCargaRemisionOrigenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
