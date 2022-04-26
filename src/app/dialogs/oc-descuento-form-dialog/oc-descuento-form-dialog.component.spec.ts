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
import { mockMonedaList } from 'src/app/interfaces/moneda';
import {
  mockOcDescuentoDialogData,
  mockOcDescuentoDialogDataWithoutItem,
} from 'src/app/interfaces/oc-descuento-dialog-data';
import { mockTipoConceptoDescuentoList } from 'src/app/interfaces/tipo-concepto-descuento';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { OcDescuentoFormDialogComponent } from './oc-descuento-form-dialog.component';

describe('OcDescuentoFormDialogComponent', () => {
  let component: OcDescuentoFormDialogComponent;
  let fixture: ComponentFixture<OcDescuentoFormDialogComponent>;
  let httpController: HttpTestingController;
  let userService: UserService;
  const dialogData = mockOcDescuentoDialogData;
  const data = dialogData.item!;
  const mockDialogRefSpyObj = jasmine.createSpyObj({
    close: () => {},
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
      ],
      providers: [
        AuthService,
        UserService,
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [OcDescuentoFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(OcDescuentoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(OcDescuentoFormDialogComponent);
    component = fixture.componentInstance;
    (userService as any).userSubject.next(mockUser);
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
      useValue: mockOcDescuentoDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(OcDescuentoFormDialogComponent);
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
      useValue: mockOcDescuentoDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OcDescuentoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      concepto_id: data.concepto_id,
      detalle: data.anticipado,
      anticipado: data.anticipado,
      // INICIO Monto a cobrar al Propietario
      propietario_monto: data.propietario_monto,
      propietario_moneda_id: data.propietario_moneda_id,
      // FIN Monto a cobrar al Propietario
      // INICIO Monto a pagar al Proveedor
      habilitar_pago_proveedor: data.habilitar_pago_proveedor,
      proveedor_monto: data.proveedor_monto,
      proveedor_moneda_id: data.proveedor_moneda_id,
      proveedor_id: data.proveedor_id,
      // FIN Monto a pagar al Proveedor
    });
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/orden_carga_descuento/`)
      .forEach((r) => r.flush(data));
    httpController.verify();
  }));
});
