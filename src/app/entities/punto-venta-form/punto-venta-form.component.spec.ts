import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockComposicionJuridicaList } from 'src/app/interfaces/composicion-juridica';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockPuntoVentaList } from 'src/app/interfaces/punto-venta';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';


import { PuntoVentaFormComponent } from './punto-venta-form.component';

describe('PuntoVentaFormComponent', () => {
  let component: PuntoVentaFormComponent;
  let fixture: ComponentFixture<PuntoVentaFormComponent>;
  let httpController: HttpTestingController;
  let puntoVentaService: PuntoVentaService;
  let pageFormComponent: DebugElement;
  const backUrl = 'entities/proveedor/edit/1';
  const proveedorId = 1;
  const puntoVenta = mockPuntoVentaList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  }
  const createRouter = {
    ...router, url: 'entities/punto-venta/create/:proveedorId',
  }
  const editRouter = {
    ...router, url: 'entities/punto-venta/edit/:proveedorId/:id',
  }
  const showRouter = {
    ...router, url: 'entities/punto-venta/show/:proveedorId/:id',
  }
  const id = puntoVenta.id;
  const route = {
    snapshot: {
      params: {
        id,
      },
      queryParams: {
        backUrl,
      },
    },
  };
  const createRoute = {
    snapshot: {
      params: {
        proveedorId
      },
      queryParams: {
        backUrl,
      },
    },
  };
  function formSetValue(component: PuntoVentaFormComponent, logo: string | null = null): void {
    component.form.setValue({
      info: {
        alias: 'Alias',
        nombre: puntoVenta.nombre,
        nombre_corto: puntoVenta.nombre_corto,
        proveedor_id: puntoVenta.proveedor_id,
        tipo_documento_id: puntoVenta.tipo_documento_id,
        numero_documento: puntoVenta.numero_documento,
        digito_verificador: puntoVenta.digito_verificador,
        composicion_juridica_id: puntoVenta.composicion_juridica_id,
        telefono: puntoVenta.telefono,
        email: puntoVenta.email,
        pagina_web: puntoVenta.pagina_web,
        info_complementaria: puntoVenta.info_complementaria,
        logo,
      },
      contactos: [],
      geo: {
        pais_id: puntoVenta.ciudad.localidad.pais_id,
        localidad_id: puntoVenta.ciudad.localidad_id,
        ciudad_id: puntoVenta.ciudad_id,
        latitud: puntoVenta.latitud,
        longitud: puntoVenta.longitud,
        direccion: puntoVenta.direccion,
      },
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'entities/punto-venta/create/:proveedorId', component: PuntoVentaFormComponent },
          { path: 'entities/punto-venta/edit/:proveedorId/:id', component: PuntoVentaFormComponent },
          { path: 'entities/punto-venta/show/:proveedorId/:id', component: PuntoVentaFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        PuntoVentaService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router }
      ],
      declarations: [ PuntoVentaFormComponent ]
    })
    .compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PuntoVentaFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/localidad/${puntoVenta.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${puntoVenta.ciudad.localidad_id}/`).flush(mockCiudadList);
    const req = httpController.expectOne(`${environment.api}/punto_venta/`)
    expect(req.request.method).toBe('POST');
    req.flush(puntoVenta);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PuntoVentaFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', null);
    const req = httpController.expectOne(`${environment.api}/punto_venta/`);
    expect(req.request.method).toBe('POST');
    req.flush(puntoVenta);
    flush();
    tick();
    httpController.expectOne(`${environment.api}/localidad/${puntoVenta.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${puntoVenta.ciudad.localidad_id}/`).flush(mockCiudadList);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PuntoVentaFormComponent);
    puntoVentaService = TestBed.inject(PuntoVentaService);
    component = fixture.componentInstance;
    const fileSpy = spyOnProperty(component, 'file').and.returnValue(fakeFile);
    const getByIdSpy = spyOn(puntoVentaService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/punto_venta/detail/${id}`).flush(puntoVenta);
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/localidad/${puntoVenta.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${puntoVenta.ciudad.localidad_id}/`).flush(mockCiudadList);
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    expect(fileSpy).toHaveBeenCalled();
    tick();
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    const req = httpController.expectOne(`${environment.api}/punto_venta/${id}`)
    expect(req.request.method).toBe('PUT');
    req.flush(puntoVenta);
    httpController.expectOne(`${environment.api}/localidad/${puntoVenta.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${puntoVenta.ciudad.localidad_id}/`).flush(mockCiudadList);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PuntoVentaFormComponent);
    puntoVentaService = TestBed.inject(PuntoVentaService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(puntoVentaService, 'getById').and.callThrough();
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/punto_venta/detail/${id}`).flush(mockPuntoVentaList[1]);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/localidad/${puntoVenta.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${puntoVenta.ciudad.localidad_id}/`).flush(mockCiudadList);
    flush();
    expect(getByIdSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    fixture = TestBed.createComponent(PuntoVentaFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    tick(500);
    const backSpy = spyOn(component, 'back').and.callThrough();
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    pageFormComponent.triggerEventHandler('editClick', null);
    tick(1);
    expect(backSpy).toHaveBeenCalled();
    expect(redirectToEditSpy).toHaveBeenCalled();
  }));
});
