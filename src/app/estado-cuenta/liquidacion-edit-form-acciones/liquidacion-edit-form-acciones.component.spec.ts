import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';
import { LiquidacionService } from 'src/app/services/liquidacion.service';

import { LiquidacionEditFormAccionesComponent } from './liquidacion-edit-form-acciones.component';

describe('LiquidacionEditFormAccionesComponent', () => {
  let component: LiquidacionEditFormAccionesComponent;
  let fixture: ComponentFixture<LiquidacionEditFormAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        EstadoCuentaModule,
      ],
      providers: [
        LiquidacionService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionEditFormAccionesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionEditFormAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
