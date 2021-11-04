import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ComposicionJuridicaService } from './composicion-juridica.service';

describe('ComposicionJuridicaService', () => {
  let service: ComposicionJuridicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComposicionJuridicaService],
    });
    service = TestBed.inject(ComposicionJuridicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
