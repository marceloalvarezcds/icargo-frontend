import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoAnticipoService } from './tipo-anticipo.service';

describe('TipoAnticipoService', () => {
  let service: TipoAnticipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoAnticipoService],
    });
    service = TestBed.inject(TipoAnticipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
