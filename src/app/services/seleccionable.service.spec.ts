import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SeleccionableService } from './seleccionable.service';

describe('SeleccionableService', () => {
  let service: SeleccionableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SeleccionableService],
    });
    service = TestBed.inject(SeleccionableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
