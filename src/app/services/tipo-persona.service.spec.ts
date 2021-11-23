import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TipoPersonaService } from './tipo-persona.service';

describe('TipoPersonaService', () => {
  let service: TipoPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoPersonaService],
    });
    service = TestBed.inject(TipoPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
