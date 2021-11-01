import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PaisService } from './pais.service';

describe('PaisService', () => {
  let service: PaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaisService],
    });
    service = TestBed.inject(PaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
