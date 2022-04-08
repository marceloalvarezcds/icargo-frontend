import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockLiquidacion1 } from 'src/app/interfaces/liquidacion';
import { EstadoCuentaModule } from '../estado-cuenta.module';
import { LiquidacionConfirmadaFormFacturasComponent } from './liquidacion-confirmada-form-facturas.component';

describe('LiquidacionConfirmadaFormFacturasComponent', () => {
  let component: LiquidacionConfirmadaFormFacturasComponent;
  let fixture: ComponentFixture<LiquidacionConfirmadaFormFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        EstadoCuentaModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionConfirmadaFormFacturasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LiquidacionConfirmadaFormFacturasComponent
    );
    component = fixture.componentInstance;
    component.liquidacion = mockLiquidacion1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
