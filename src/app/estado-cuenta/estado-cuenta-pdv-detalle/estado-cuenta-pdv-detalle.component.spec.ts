import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaPdvDetalleComponent } from './estado-cuenta-pdv-detalle.component';

describe('EstadoCuentaPdvDetalleComponent', () => {
  let component: EstadoCuentaPdvDetalleComponent;
  let fixture: ComponentFixture<EstadoCuentaPdvDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaPdvDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaPdvDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
