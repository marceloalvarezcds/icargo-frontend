import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoVentaPrecioFormComponent } from './insumo-venta-precio-form.component';

describe('InsumoVentaPrecioFormComponent', () => {
  let component: InsumoVentaPrecioFormComponent;
  let fixture: ComponentFixture<InsumoVentaPrecioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumoVentaPrecioFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoVentaPrecioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
