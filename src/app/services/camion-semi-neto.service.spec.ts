import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CamionSemiNetoService } from './camion-semi-neto.service';

describe('CamionSemiNetoService', () => {
  let service: CamionSemiNetoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CamionSemiNetoService],
    });
    service = TestBed.inject(CamionSemiNetoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
