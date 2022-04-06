import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TipoInstrumentoService } from './tipo-instrumento.service';

describe('TipoInstrumentoService', () => {
  let service: TipoInstrumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoInstrumentoService],
    });
    service = TestBed.inject(TipoInstrumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
