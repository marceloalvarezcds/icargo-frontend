import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EstadoCuentaService } from './estado-cuenta.service';

describe('EstadoCuentaService', () => {
  let service: EstadoCuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstadoCuentaService],
    });
    service = TestBed.inject(EstadoCuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
