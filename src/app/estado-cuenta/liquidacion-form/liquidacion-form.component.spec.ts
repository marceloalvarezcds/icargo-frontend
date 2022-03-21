import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockEstadoCuentaList } from 'src/app/interfaces/estado-cuenta';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';

import { LiquidacionFormComponent } from './liquidacion-form.component';

describe('LiquidacionFormComponent', () => {
  let component: LiquidacionFormComponent;
  let fixture: ComponentFixture<LiquidacionFormComponent>;
  const estadoCuenta = mockEstadoCuentaList[0];
  const route = {
    snapshot: {
      queryParams: {
        tipo_contraparte_id: estadoCuenta.tipo_contraparte_id,
        contraparte: estadoCuenta.contraparte,
        contraparte_numero_documento: estadoCuenta.contraparte_numero_documento,
        estado: EstadoEnum.FINALIZADO,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        EstadoCuentaModule,
      ],
      providers: [
        EstadoCuentaService,
        LiquidacionService,
        MovimientoService,
        { provide: ActivatedRoute, useValue: route },
        { provide: MatDialogRef, useValue: MatDialog },
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
