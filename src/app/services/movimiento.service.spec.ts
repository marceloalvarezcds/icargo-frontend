import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MovimientoService } from './movimiento.service';

describe('MovimientoService', () => {
  let service: MovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovimientoService],
    });
    service = TestBed.inject(MovimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
