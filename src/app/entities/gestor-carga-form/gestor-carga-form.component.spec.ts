import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { mockComposicionJuridicaList } from 'src/app/interfaces/composicion-juridica';
import { mockGestorCargaList } from 'src/app/interfaces/gestor-carga';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { MaterialModule } from 'src/app/material/material.module';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { fakeFileList, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { GestorCargaFormComponent } from './gestor-carga-form.component';

describe('GestorCargaFormComponent', () => {
  let component: GestorCargaFormComponent;
  let fixture: ComponentFixture<GestorCargaFormComponent>;
  let httpController: HttpTestingController;
  let gestorCargaService: GestorCargaService;
  let pageFormComponent: DebugElement;
  const gestorCarga = mockGestorCargaList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  }
  const createRouter = {
    ...router, url: `entities/${m.GESTOR_CARGA}/${a.CREAR}`,
  }
  const editRouter = {
    ...router, url: `entities/${m.GESTOR_CARGA}/${a.EDITAR}/:id`,
  }
  const showRouter = {
    ...router, url: `entities/${m.GESTOR_CARGA}/${a.VER}`,
  }
  const id = gestorCarga.id;
  const route = {
    snapshot: {
      params: {
        id,
      },
    },
  };
  const createRoute = {
    snapshot: {
      params: { },
    },
  };
  function formSetValue(component: GestorCargaFormComponent, logo: string | null = null): void {
    component.form.setValue({
      info: {
        nombre: gestorCarga.nombre,
        nombre_corto: gestorCarga.nombre_corto,
        tipo_documento_id: gestorCarga.tipo_documento_id,
        numero_documento: gestorCarga.numero_documento,
        digito_verificador: gestorCarga.digito_verificador,
        composicion_juridica_id: gestorCarga.composicion_juridica_id,
        moneda_id: gestorCarga.moneda_id,
        telefono: gestorCarga.telefono,
        email: gestorCarga.email,
        pagina_web: gestorCarga.pagina_web,
        info_complementaria: gestorCarga.info_complementaria,
        logo,
      },
      geo: {
        pais_id: gestorCarga.ciudad.localidad.pais_id,
        localidad_id: gestorCarga.ciudad.localidad_id,
        ciudad_id: gestorCarga.ciudad_id,
        latitud: gestorCarga.latitud,
        longitud: gestorCarga.longitud,
        direccion: gestorCarga.direccion,
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
          { path: `entities/${m.GESTOR_CARGA}/${a.CREAR}`, component: GestorCargaFormComponent },
          { path: `entities/${m.GESTOR_CARGA}/${a.EDITAR}`, component: GestorCargaFormComponent },
          { path: `entities/${m.GESTOR_CARGA}/${a.VER}`, component: GestorCargaFormComponent },
        ]),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        GestorCargaService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        MonedaService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router }
      ],
      declarations: [ GestorCargaFormComponent ]
    })
    .compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GestorCargaFormComponent);
    component = fixture.componentInstance;
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.files = fakeFileList;
    fileInput.dispatchEvent(new Event('change'));
    expect(component).toBeTruthy();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/moneda/`).flush(mockTipoDocumentoList);
    const req = httpController.expectOne(`${environment.api}/gestor_carga/`)
    expect(req.request.method).toBe('POST');
    req.flush(gestorCarga);
    flush();
    expect(fileChangeSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GestorCargaFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/moneda/`).flush(mockTipoDocumentoList);
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', null);
    const req = httpController.expectOne(`${environment.api}/gestor_carga/`);
    expect(req.request.method).toBe('POST');
    req.flush(gestorCarga);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GestorCargaFormComponent);
    gestorCargaService = TestBed.inject(GestorCargaService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(gestorCargaService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/gestor_carga/${id}`).flush(gestorCarga);
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/moneda/`).flush(mockTipoDocumentoList);
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    const req = httpController.expectOne(`${environment.api}/gestor_carga/${id}`)
    expect(req.request.method).toBe('PUT');
    req.flush(gestorCarga);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GestorCargaFormComponent);
    gestorCargaService = TestBed.inject(GestorCargaService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(gestorCargaService, 'getById').and.callThrough();
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/moneda/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/gestor_carga/${id}`).flush(mockGestorCargaList[1]);
    flush();
    expect(getByIdSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    fixture = TestBed.createComponent(GestorCargaFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    fixture.detectChanges();
    tick(500);
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.dispatchEvent(new Event('change'));
    const backSpy = spyOn(component, 'back').and.callThrough();
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    pageFormComponent.triggerEventHandler('editClick', null);
    tick(1);
    expect(backSpy).toHaveBeenCalled();
    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(fileChangeSpy).toHaveBeenCalled();
  }));
});
