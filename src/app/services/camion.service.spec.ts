import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CamionService } from './camion.service';

describe('CamionService', () => {
  let service: CamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CamionService],
    });
    service = TestBed.inject(CamionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
