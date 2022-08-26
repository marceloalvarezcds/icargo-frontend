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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FleteDescuento,
  mockFleteDescuentoList,
} from 'src/app/interfaces/flete-descuento';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockProveedorList } from 'src/app/interfaces/proveedor';
import { mockTipoConceptoDescuentoList } from 'src/app/interfaces/tipo-concepto-descuento';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import { DescuentoFormDialogComponent } from './descuento-form-dialog.component';

describe('DescuentoFormDialogComponent', () => {
  let component: DescuentoFormDialogComponent;
  let fixture: ComponentFixture<DescuentoFormDialogComponent>;
  let httpController: HttpTestingController;
  let userService: UserService;
  const data = mockFleteDescuentoList[0];
  const mockDialogRefSpyObj = jasmine.createSpyObj({
    close: (data?: FleteDescuento) => {},
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
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DescuentoFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(DescuentoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(DescuentoFormDialogComponent);
    component = fixture.componentInstance;
    (userService as any).userSubject.next(mockUser);
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    fixture = TestBed.createComponent(DescuentoFormDialogComponent);
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
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DescuentoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      concepto: data.concepto,
      detalle: data.anticipado,
      anticipado: data.anticipado,
      // INICIO Monto a cobrar al Propietario
      propietario_monto: data.propietario_monto,
      propietario_moneda: data.propietario_moneda,
      // FIN Monto a cobrar al Propietario
      // INICIO Monto a pagar al Proveedor
      habilitar_pago_proveedor: data.habilitar_pago_proveedor,
      proveedor_monto: data.proveedor_monto,
      proveedor_moneda: data.proveedor_moneda,
      proveedor: data.proveedor,
      // FIN Monto a pagar al Proveedor
    });
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/proveedor/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockProveedorList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
