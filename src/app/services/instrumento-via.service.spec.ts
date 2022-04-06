import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InstrumentoViaService } from './instrumento-via.service';

describe('InstrumentoViaService', () => {
  let service: InstrumentoViaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstrumentoViaService],
    });
    service = TestBed.inject(InstrumentoViaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
