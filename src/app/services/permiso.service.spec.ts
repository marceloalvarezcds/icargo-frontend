import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PermisoService } from './permiso.service';

describe('PermisoService', () => {
  let service: PermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermisoService],
    });
    service = TestBed.inject(PermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
