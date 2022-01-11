import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrdenCargaService } from './orden-carga.service';

describe('OrdenCargaService', () => {
  let service: OrdenCargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdenCargaService],
    });
    service = TestBed.inject(OrdenCargaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
