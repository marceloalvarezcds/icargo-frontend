import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockFleteAnticipoList } from 'src/app/interfaces/flete-anticipo';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockOcAnticipoRetiradoDialogData, mockOcAnticipoRetiradoDialogDataWithoutItem, OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { mockProveedorList } from 'src/app/interfaces/proveedor';
import { mockPuntoVentaList } from 'src/app/interfaces/punto-venta';
import { mockTipoAnticipoList } from 'src/app/interfaces/tipo-anticipo';
import { mockTipoComprobanteList } from 'src/app/interfaces/tipo-comprobante';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import { OcAnticipoRetiradoFormDialogComponent } from './oc-anticipo-retirado-form-dialog.component';

describe('OcAnticipoRetiradoFormDialogComponent', () => {
  let component: OcAnticipoRetiradoFormDialogComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoFormDialogComponent>;
  let httpController: HttpTestingController;
  let userService: UserService;
  const dialogData = mockOcAnticipoRetiradoDialogData;
  const data = dialogData.item!;
  const fleteId = dialogData.flete_id;
  const fleteAnticipo = mockFleteAnticipoList[0];
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close : (data?: OcAnticipoRetiradoDialogData) => {} });

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
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ OcAnticipoRetiradoFormDialogComponent ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(OcAnticipoRetiradoFormDialogComponent);
    component = fixture.componentInstance;
    (userService as any).userSubject.next(mockUser);
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockOcAnticipoRetiradoDialogDataWithoutItem });
    fixture = TestBed.createComponent(OcAnticipoRetiradoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockOcAnticipoRetiradoDialogDataWithoutItem });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OcAnticipoRetiradoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      tipo_anticipo_id: data.tipo_anticipo_id,
      tipo_insumo_id: data.tipo_insumo_id ?? null,
      flete_anticipo_id: data.flete_anticipo_id,
      proveedor_id: data.proveedor_id,
      punto_venta_id: data.punto_venta_id,
      moneda_id: data.moneda_id,
      tipo_comprobante_id: data.tipo_comprobante_id,
      numero_comprobante: data.numero_comprobante,
      monto_retirado: data.monto_retirado,
      insumo_id: data.insumo_id ?? null,
      insumo_punto_venta_precio_id: data.insumo_punto_venta_precio_id ?? null,
      observacion: data.observacion,
      unidad_id: data.unidad_id ?? null,
      cantidad_retirada: data.cantidad_retirada ?? null,
      precio_unitario: data.precio_unitario ?? null,
    });
    tick(500);
    tick(500);
    httpController.match(`${environment.api}/tipo_anticipo/flete/${fleteId}`).forEach(r => r.flush(mockTipoAnticipoList));
    httpController.match(`${environment.api}/flete_anticipo/tipo/${data.tipo_anticipo_id}/flete/${fleteId}`).forEach(r => r.flush(fleteAnticipo));
    httpController.match(`${environment.api}/proveedor/insumo/${data.insumo_id}`).forEach(r => r.flush(mockProveedorList));
    httpController.match(`${environment.api}/punto_venta/${data.proveedor_id}`).forEach(r => r.flush(mockPuntoVentaList));
    httpController.match(`${environment.api}/moneda/`).forEach(r => r.flush(mockMonedaList));
    httpController.match(`${environment.api}/tipo_comprobante/`).forEach(r => r.flush(mockTipoComprobanteList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController.match(`${environment.api}/orden_carga_anticipo_retirado/`).forEach(r => r.flush(data));
    httpController.verify();
  }));
});
