import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContraparteService } from './contraparte.service';

describe('ContraparteService', () => {
  let service: ContraparteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContraparteService],
    });
    service = TestBed.inject(ContraparteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
