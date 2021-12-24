import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FleteService } from './flete.service';

describe('FleteService', () => {
  let service: FleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleteService],
    });
    service = TestBed.inject(FleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
