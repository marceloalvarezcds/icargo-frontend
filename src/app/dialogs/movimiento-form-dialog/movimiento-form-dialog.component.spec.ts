import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import {
  mockMovimientoFormDialogData,
  mockMovimientoFormDialogDataWithoutItem,
} from 'src/app/interfaces/movimiento-form-dialog-data';
import { mockTipoContraparteList } from 'src/app/interfaces/tipo-contraparte';
import { mockTipoMovimientoList } from 'src/app/interfaces/tipo-movimiento';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';
import { DialogsModule } from '../dialogs.module';
import { MovimientoFormDialogComponent } from './movimiento-form-dialog.component';

describe('MovimientoFormDialogComponent', () => {
  let component: MovimientoFormDialogComponent;
  let fixture: ComponentFixture<MovimientoFormDialogComponent>;
  let httpController: HttpTestingController;
  const dialogData = mockMovimientoFormDialogData;
  const data = dialogData.item!;
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close: () => {} });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        DialogsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MovimientoFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MovimientoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    fixture = TestBed.createComponent(MovimientoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockMovimientoFormDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(MovimientoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockMovimientoFormDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MovimientoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.patchValue({
      tipo_contraparte_id: data.tipo_contraparte_id,
      contraparte: data.contraparte,
      contraparte_numero_documento: data.contraparte_numero_documento,
      liquidacion_id: data.liquidacion_id,
      tipo_documento_relacionado_id: data.tipo_documento_relacionado_id,
      numero_documento_relacionado: data.numero_documento_relacionado,
      cuenta_id: data.cuenta_id,
      tipo_movimiento_id: data.tipo_movimiento_id,
      es_cobro: data.es_cobro,
      estado: EstadoEnum.ACTIVO,
      fecha: data.fecha,
      monto: data.monto,
      moneda_id: data.moneda_id,
      detalle: data.detalle,
      tipo_cambio_moneda: data.tipo_cambio_moneda,
      fecha_cambio_moneda: data.fecha_cambio_moneda,
      chofer_id: data.chofer_id,
      propietario_id: data.propietario_id,
      proveedor_id: data.proveedor_id,
      remitente_id: data.remitente_id,
    });
    httpController
      .match(`${environment.api}/tipo_movimiento/active_list`)
      .forEach((r) => r.flush(mockTipoMovimientoList));
    httpController
      .match(`${environment.api}/tipo_contraparte/`)
      .forEach((r) => r.flush(mockTipoContraparteList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/movimiento/`)
      .forEach((r) => r.flush(data));
    httpController.verify();
  }));
});
