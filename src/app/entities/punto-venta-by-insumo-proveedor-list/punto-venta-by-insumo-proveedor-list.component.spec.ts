import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaByInsumoProveedorListComponent } from './punto-venta-by-insumo-proveedor-list.component';

describe('PuntoVentaByInsumoProveedorListComponent', () => {
  let component: PuntoVentaByInsumoProveedorListComponent;
  let fixture: ComponentFixture<PuntoVentaByInsumoProveedorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaByInsumoProveedorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaByInsumoProveedorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
