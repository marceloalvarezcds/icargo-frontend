import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BancoService } from './banco.service';

describe('BancoService', () => {
  let service: BancoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BancoService],
    });
    service = TestBed.inject(BancoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
