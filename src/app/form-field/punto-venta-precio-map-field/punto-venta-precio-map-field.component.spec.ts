import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaPrecioMapFieldComponent } from './punto-venta-precio-map-field.component';

describe('PuntoVentaPrecioMapFieldComponent', () => {
  let component: PuntoVentaPrecioMapFieldComponent;
  let fixture: ComponentFixture<PuntoVentaPrecioMapFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaPrecioMapFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaPrecioMapFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
