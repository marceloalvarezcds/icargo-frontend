import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InsumoService } from './insumo.service';

describe('InsumoService', () => {
  let service: InsumoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InsumoService],
    });
    service = TestBed.inject(InsumoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
