import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaMapByEfectivoDialogFieldComponent } from './punto-venta-map-by-efectivo-dialog-field.component';

describe('PuntoVentaMapByEfectivoDialogFieldComponent', () => {
  let component: PuntoVentaMapByEfectivoDialogFieldComponent;
  let fixture: ComponentFixture<PuntoVentaMapByEfectivoDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaMapByEfectivoDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaMapByEfectivoDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
