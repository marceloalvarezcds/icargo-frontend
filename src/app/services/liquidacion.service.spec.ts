import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LiquidacionService } from './liquidacion.service';

describe('LiquidacionService', () => {
  let service: LiquidacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LiquidacionService],
    });
    service = TestBed.inject(LiquidacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
