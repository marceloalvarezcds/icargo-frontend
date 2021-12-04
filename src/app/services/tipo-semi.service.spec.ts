import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoSemiService } from './tipo-semi.service';

describe('TipoSemiService', () => {
  let service: TipoSemiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoSemiService],
    });
    service = TestBed.inject(TipoSemiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
