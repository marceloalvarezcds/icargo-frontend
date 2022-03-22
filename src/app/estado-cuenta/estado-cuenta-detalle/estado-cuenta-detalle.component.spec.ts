import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoCuentaModule } from '../estado-cuenta.module';

import { EstadoCuentaDetalleComponent } from './estado-cuenta-detalle.component';

describe('EstadoCuentaDetalleComponent', () => {
  let component: EstadoCuentaDetalleComponent;
  let fixture: ComponentFixture<EstadoCuentaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, EstadoCuentaModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [EstadoCuentaDetalleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
