import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoVentaPrecioDialogComponent } from './insumo-venta-precio-dialog.component';

describe('InsumoVentaPrecioDialogComponent', () => {
  let component: InsumoVentaPrecioDialogComponent;
  let fixture: ComponentFixture<InsumoVentaPrecioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumoVentaPrecioDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoVentaPrecioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
