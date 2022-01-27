import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FleteAnticipoService } from './flete-anticipo.service';

describe('FleteAnticipoService', () => {
  let service: FleteAnticipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleteAnticipoService],
    });
    service = TestBed.inject(FleteAnticipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
