import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockPropietarioList } from 'src/app/interfaces/propietario';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockTipoPersonaList } from 'src/app/interfaces/tipo-persona';
import { mockTipoRegistroList } from 'src/app/interfaces/tipo-registro';
import { mockUser, mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { PropietarioFormChoferComponent } from '../propietario-form-chofer/propietario-form-chofer.component';
import { PropietarioFormInfoComponent } from '../propietario-form-info/propietario-form-info.component';
import { RegistroConduccionFormComponent } from '../registro-conduccion-form/registro-conduccion-form.component';

import { PropietarioFormComponent } from './propietario-form.component';

describe('PropietarioFormComponent', () => {
  let component: PropietarioFormComponent;
  let fixture: ComponentFixture<PropietarioFormComponent>;
  let httpController: HttpTestingController;
  let propietarioService: PropietarioService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  let propietarioFormInfo: DebugElement;
  let propietarioFormChofer: DebugElement;
  let registroConduccionForm: DebugElement;
  const propietario = mockPropietarioList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  }
  const createRouter = {
    ...router, url: `flota/${m.PROPIETARIO}/${a.CREAR}`,
  }
  const editRouter = {
    ...router, url: `flota/${m.PROPIETARIO}/${a.EDITAR}/:id`,
  }
  const showRouter = {
    ...router, url: `flota/${m.PROPIETARIO}/${a.VER}`,
  }
  const id = propietario.id;
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
  function formSetValue(component: PropietarioFormComponent, fileUrl: string | null = null): void {
    component.form.setValue({
      info: {
        alias: 'Alias',
        nombre: propietario.nombre,
        tipo_persona_id: propietario.tipo_persona_id,
        ruc: propietario.ruc,
        digito_verificador: propietario.digito_verificador,
        pais_origen_id: propietario.pais_origen_id,
        fecha_nacimiento: propietario.fecha_nacimiento,
        oficial_cuenta_id: propietario.oficial_cuenta_id,
        telefono: propietario.telefono,
        email: propietario.email,
        es_chofer: propietario.es_chofer,
        foto_documento_frente: fileUrl,
        foto_documento_reverso: fileUrl,
        foto_perfil: fileUrl,
      },
      chofer: {
        tipo_documento_id: propietario.tipo_documento_id,
        pais_emisor_documento_id: propietario.pais_emisor_documento_id,
        numero_documento: propietario.numero_documento,
        foto_documento_frente_chofer: null,
        foto_documento_reverso_chofer: null,
      },
      registro: {
        pais_emisor_registro_id: propietario.pais_emisor_documento_id,
        localidad_emisor_registro_id: propietario.localidad_emisor_registro_id,
        ciudad_emisor_registro_id: propietario.ciudad_emisor_registro_id,
        tipo_registro_id: propietario.tipo_registro_id,
        numero_registro: propietario.numero_registro,
        vencimiento_registro: propietario.vencimiento_registro,
        foto_registro_frente: null,
        foto_registro_reverso: null,
      },
      contactos: [],
      address: {
        pais_id: propietario.ciudad.localidad.pais_id,
        localidad_id: propietario.ciudad.localidad_id,
        ciudad_id: propietario.ciudad_id,
        direccion: propietario.direccion,
      },
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormFieldModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: `flota/${m.PROPIETARIO}/${a.CREAR}`, component: PropietarioFormComponent },
          { path: `flota/${m.PROPIETARIO}/${a.EDITAR}`, component: PropietarioFormComponent },
          { path: `flota/${m.PROPIETARIO}/${a.VER}`, component: PropietarioFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        PropietarioService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router }
      ],
      declarations: [
        PropietarioFormComponent,
        PropietarioFormInfoComponent,
        PropietarioFormChoferComponent,
        RegistroConduccionFormComponent,
      ],
    })
    .compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    httpController.match(`${environment.api}/tipo_documento/`).forEach(r => r.flush(mockTipoDocumentoList));
    httpController.match(`${environment.api}/tipo_persona/`).forEach(r => r.flush(mockTipoPersonaList));
    httpController.match(`${environment.api}/tipo_registro/`).forEach(r => r.flush(mockTipoRegistroList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    const req = httpController.expectOne(`${environment.api}/propietario/`)
    expect(req.request.method).toBe('POST');
    req.flush(propietario);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    httpController.match(`${environment.api}/tipo_documento/`).forEach(r => r.flush(mockTipoDocumentoList));
    httpController.match(`${environment.api}/tipo_persona/`).forEach(r => r.flush(mockTipoPersonaList));
    httpController.match(`${environment.api}/tipo_registro/`).forEach(r => r.flush(mockTipoRegistroList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/propietario/`);
    expect(req.request.method).toBe('POST');
    req.flush(propietario);
    flush();
    tick();
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(PropietarioFormComponent);
    propietarioService = TestBed.inject(PropietarioService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(propietarioService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController.match(`${environment.api}/propietario/${id}`).forEach(r => r.flush(propietario));
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/tipo_persona/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/tipo_registro/`).flush(mockTipoRegistroList);
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    pageFormComponent = findElement(fixture, 'app-page-form');
    propietarioFormInfo = findElement(fixture, 'app-propietario-form-info');
    propietarioFormChofer = findElement(fixture, 'app-propietario-form-chofer');
    registroConduccionForm = findElement(fixture, 'app-registro-conduccion-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    propietarioFormInfo.triggerEventHandler('fotoDocumentoFrenteChange', fakeFile);
    propietarioFormInfo.triggerEventHandler('fotoDocumentoReversoChange', fakeFile);
    propietarioFormInfo.triggerEventHandler('fotoPerfilChange', fakeFile);
    propietarioFormChofer.triggerEventHandler('fotoDocumentoFrenteChange', fakeFile);
    propietarioFormChofer.triggerEventHandler('fotoDocumentoReversoChange', fakeFile);
    propietarioFormChofer.triggerEventHandler('fotoPerfilChange', fakeFile);
    registroConduccionForm.triggerEventHandler('fotoRegistroFrenteChange', fakeFile);
    registroConduccionForm.triggerEventHandler('fotoRegistroReversoChange', fakeFile);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    httpController.match(`${environment.api}/propietario/${id}`).forEach(req => {
      expect(req.request.method).toBe('PUT');
      req.flush(propietario);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormComponent);
    propietarioService = TestBed.inject(PropietarioService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const getByIdSpy = spyOn(propietarioService, 'getById').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.match(`${environment.api}/propietario/${id}`).forEach(r => r.flush(mockPropietarioList[1]));
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    httpController.expectOne(`${environment.api}/tipo_persona/`).flush(mockTipoDocumentoList);
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    tick(1);
    expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/propietario/${id}`).flush(propietario);
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    httpController.expectOne(`${environment.api}/tipo_persona/`).flush(mockTipoDocumentoList);
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${propietario.ciudad.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${propietario.ciudad.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    tick(500);
    const backSpy = spyOn(component, 'back').and.callThrough();
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    pageFormComponent.triggerEventHandler('editClick', null);
    tick(1);
    expect(backSpy).toHaveBeenCalled();
    expect(redirectToEditSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
