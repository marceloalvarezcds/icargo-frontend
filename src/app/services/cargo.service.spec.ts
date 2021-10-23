import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CargoService } from './cargo.service';

describe('CargoService', () => {
  let service: CargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CargoService],
    });
    service = TestBed.inject(CargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
