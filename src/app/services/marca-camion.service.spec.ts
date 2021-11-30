import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MarcaCamionService } from './marca-camion.service';

describe('MarcaCamionService', () => {
  let service: MarcaCamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarcaCamionService],
    });
    service = TestBed.inject(MarcaCamionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
