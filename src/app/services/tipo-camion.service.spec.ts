import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoCamionService } from './tipo-camion.service';

describe('TipoCamionService', () => {
  let service: TipoCamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoCamionService],
    });
    service = TestBed.inject(TipoCamionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
