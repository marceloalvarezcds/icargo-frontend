import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaListDetalleComponent } from './estado-cuenta-list-detalle.component';

describe('EstadoCuentaListDetalleComponent', () => {
  let component: EstadoCuentaListDetalleComponent;
  let fixture: ComponentFixture<EstadoCuentaListDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaListDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaListDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
