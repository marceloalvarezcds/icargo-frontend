import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CentroOperativoService } from './centro-operativo.service';

describe('CentroOperativoService', () => {
  let service: CentroOperativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CentroOperativoService],
    });
    service = TestBed.inject(CentroOperativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
