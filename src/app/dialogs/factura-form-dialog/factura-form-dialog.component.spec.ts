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
import {
  mockFacturaFormDialogData,
  mockFacturaFormDialogDataWithoutItem,
} from 'src/app/interfaces/factura-form-dialog-data';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockTipoIvaList } from 'src/app/interfaces/tipo-iva';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';
import { DialogsModule } from '../dialogs.module';
import { FacturaFormDialogComponent } from './factura-form-dialog.component';

describe('FacturaFormDialogComponent', () => {
  let component: FacturaFormDialogComponent;
  let fixture: ComponentFixture<FacturaFormDialogComponent>;
  let httpController: HttpTestingController;
  const dialogData = mockFacturaFormDialogData;
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
      declarations: [FacturaFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(FacturaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    fixture = TestBed.createComponent(FacturaFormDialogComponent);
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
      useValue: mockFacturaFormDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(FacturaFormDialogComponent);
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
      useValue: mockFacturaFormDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FacturaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      moneda_id: data.moneda_id,
      numero_factura: data.numero_factura,
      fecha_vencimiento: data.fecha_vencimiento,
      monto: data.monto,
      iva_id: data.iva_id,
      foto: data.foto,
    });
    httpController
      .match(`${environment.api}/tipo_iva/`)
      .forEach((r) => r.flush(mockTipoIvaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/factura/`)
      .forEach((r) => r.flush(data));
    httpController.verify();
  }));
});
