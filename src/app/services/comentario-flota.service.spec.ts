import { TestBed } from '@angular/core/testing';

import { ComentarioFlotaService } from './comentario-flota.service';

describe('ComentarioFlotaService', () => {
  let service: ComentarioFlotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentarioFlotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
