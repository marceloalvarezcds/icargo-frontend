import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoByPuntoVentaFieldComponent } from './insumo-by-punto-venta-field.component';

describe('InsumoByPuntoVentaFieldComponent', () => {
  let component: InsumoByPuntoVentaFieldComponent;
  let fixture: ComponentFixture<InsumoByPuntoVentaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumoByPuntoVentaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoByPuntoVentaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
