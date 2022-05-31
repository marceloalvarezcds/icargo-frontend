import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ChoferFormInfoComponent } from 'src/app/flota/chofer-form-info/chofer-form-info.component';
import { ChoferFormPropietarioComponent } from 'src/app/flota/chofer-form-propietario/chofer-form-propietario.component';
import { RegistroConduccionFormComponent } from 'src/app/flota/registro-conduccion-form/registro-conduccion-form.component';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockChoferList } from 'src/app/interfaces/chofer';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockTipoRegistroList } from 'src/app/interfaces/tipo-registro';
import { mockUser, mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ChoferService } from 'src/app/services/chofer.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { ChoferFormComponent } from './chofer-form.component';

describe('ChoferFormComponent', () => {
  let component: ChoferFormComponent;
  let fixture: ComponentFixture<ChoferFormComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let choferService: ChoferService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  let choferFormInfo: DebugElement;
  let choferFormPropietario: DebugElement;
  let registroConduccionForm: DebugElement;
  const chofer = mockChoferList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `flota/${m.CHOFER}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `flota/${m.CHOFER}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `flota/${m.CHOFER}/${a.VER}`,
  };
  const id = chofer.id;
  const route = {
    snapshot: {
      params: {
        id,
      },
    },
  };
  const createRoute = {
    snapshot: {
      params: {},
    },
  };
  function formSetValue(
    component: ChoferFormComponent,
    fileUrl: string | null = null
  ): void {
    component.form.patchValue({
      info: {
        alias: chofer.gestor_carga_chofer?.alias ?? chofer.nombre,
        nombre: chofer.nombre,
        tipo_documento_id: chofer.tipo_documento_id,
        pais_emisor_documento_id: chofer.pais_emisor_documento_id,
        numero_documento: chofer.numero_documento,
        ruc: chofer.ruc,
        digito_verificador: chofer.digito_verificador,
        fecha_nacimiento: chofer.fecha_nacimiento,
        oficial_cuenta_id: chofer.oficial_cuenta_id,
        telefono: chofer.telefono,
        email: chofer.email,
        es_propietario: chofer.es_propietario,
        foto_documento_frente: fileUrl,
        foto_documento_reverso: fileUrl,
        foto_perfil: fileUrl,
      },
      propietario: {
        pais_origen_id: chofer.pais_origen_id ?? null,
        foto_documento_frente_propietario: fileUrl,
        foto_documento_reverso_propietario: fileUrl,
      },
      registro: {
        pais_emisor_registro_id: chofer.pais_emisor_documento_id ?? null,
        localidad_emisor_registro_id:
          chofer.localidad_emisor_registro_id ?? null,
        ciudad_emisor_registro_id: chofer.ciudad_emisor_registro_id ?? null,
        tipo_registro_id: chofer.tipo_registro_id ?? null,
        numero_registro: chofer.numero_registro ?? null,
        vencimiento_registro: chofer.vencimiento_registro ?? null,
        foto_registro_frente: fileUrl,
        foto_registro_reverso: fileUrl,
      },
      address: {
        ciudad_id: chofer.ciudad_id,
        direccion: chofer.direccion,
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
          {
            path: `flota/${m.CHOFER}/${a.CREAR}`,
            component: ChoferFormComponent,
          },
          {
            path: `flota/${m.CHOFER}/${a.EDITAR}`,
            component: ChoferFormComponent,
          },
          {
            path: `flota/${m.CHOFER}/${a.VER}`,
            component: ChoferFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        ChoferService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        TipoRegistroService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [
        ChoferFormComponent,
        ChoferFormInfoComponent,
        ChoferFormPropietarioComponent,
        RegistroConduccionFormComponent,
      ],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush([mockUser]);
    httpController
      .match(`${environment.api}/tipo_documento/`)
      .forEach((r) => r.flush(mockTipoDocumentoList));
    httpController
      .match(`${environment.api}/tipo_registro/`)
      .forEach((r) => r.flush(mockTipoRegistroList));
    httpController
      .match(`${environment.api}/pais/`)
      .forEach((r) => r.flush(mockPaisList));
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/`)
      .forEach((r) => r.flush(mockCiudadList));
    const req = httpController.expectOne(`${environment.api}/chofer/`);
    expect(req.request.method).toBe('POST');
    req.flush(chofer);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush([mockUser]);
    httpController
      .match(`${environment.api}/tipo_documento/`)
      .forEach((r) => r.flush(mockTipoDocumentoList));
    httpController
      .match(`${environment.api}/tipo_registro/`)
      .forEach((r) => r.flush(mockTipoRegistroList));
    httpController
      .match(`${environment.api}/pais/`)
      .forEach((r) => r.flush(mockPaisList));
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/chofer/`);
    expect(req.request.method).toBe('POST');
    req.flush(chofer);
    flush();
    tick();
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ChoferFormComponent);
    choferService = TestBed.inject(ChoferService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(choferService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/chofer/${id}`)
      .forEach((r) => r.flush(chofer));
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush([mockUser]);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .match(`${environment.api}/tipo_registro/`)
      .forEach((r) => r.flush(mockTipoRegistroList));
    httpController
      .match(`${environment.api}/pais/`)
      .forEach((r) => r.flush(mockPaisList));
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/${chofer.ciudad?.localidad_id}/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    choferFormInfo = findElement(fixture, 'app-chofer-form-info');
    choferFormPropietario = findElement(fixture, 'app-chofer-form-propietario');
    registroConduccionForm = findElement(
      fixture,
      'app-registro-conduccion-form'
    );
    pageFormComponent.triggerEventHandler('backClick', true);
    choferFormInfo.triggerEventHandler('fotoDocumentoFrenteChange', fakeFile);
    choferFormInfo.triggerEventHandler('fotoDocumentoReversoChange', fakeFile);
    choferFormInfo.triggerEventHandler('fotoPerfilChange', fakeFile);
    choferFormPropietario.triggerEventHandler(
      'fotoDocumentoFrenteChange',
      fakeFile
    );
    choferFormPropietario.triggerEventHandler(
      'fotoDocumentoReversoChange',
      fakeFile
    );
    registroConduccionForm.triggerEventHandler(
      'fotoRegistroFrenteChange',
      fakeFile
    );
    registroConduccionForm.triggerEventHandler(
      'fotoRegistroReversoChange',
      fakeFile
    );
    tick();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/${chofer.ciudad?.localidad_id}/`)
      .forEach((r) => r.flush(mockCiudadList));
    httpController.match(`${environment.api}/chofer/${id}`).forEach((req) => {
      expect(req.request.method).toBe('PUT');
      req.flush(chofer);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/chofer/${id}`)
      .forEach((r) => r.flush(chofer));
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/`)
      .forEach((r) => r.flush(mockCiudadList));
    tick();
    flush();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    const mockChofer = mockChoferList[1];
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormComponent);
    choferService = TestBed.inject(ChoferService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const activeSpy = spyOn(component, 'active').and.callThrough();
    const dialogSpy = spyOn(
      (component as any).dialog,
      'changeStatusConfirm'
    ).and.returnValue(dialogRefSpyObj);
    const inactiveSpy = spyOn(component, 'inactive').and.callThrough();
    const getByIdSpy = spyOn(choferService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    component.info
      .get('fecha_nacimiento')
      ?.setValue(mockChofer.fecha_nacimiento);
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/chofer/${id}`)
      .forEach((r) => r.flush(mockChofer));
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush([mockUser]);
    httpController
      .match(`${environment.api}/tipo_documento/`)
      .forEach((r) => r.flush(mockTipoDocumentoList));
    httpController
      .match(`${environment.api}/pais/`)
      .forEach((r) => r.flush(mockPaisList));
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    pageFormComponent.triggerEventHandler('activeClick', null);
    pageFormComponent.triggerEventHandler('inactiveClick', null);
    httpController
      .match(`${environment.api}/chofer/${id}/active`)
      .forEach((r) => r.flush(mockChofer));
    httpController
      .match(`${environment.api}/chofer/${id}/inactive`)
      .forEach((r) => r.flush(mockChofer));
    flush();
    tick(1);
    expect(inactiveSpy).toHaveBeenCalled();
    expect(activeSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/chofer/${id}`).flush(chofer);
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush([mockUser]);
    httpController
      .match(`${environment.api}/tipo_documento/`)
      .forEach((r) => r.flush(mockTipoDocumentoList));
    httpController
      .match(`${environment.api}/pais/`)
      .forEach((r) => r.flush(mockPaisList));
    httpController
      .match(`${environment.api}/localidad/${chofer.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/`)
      .forEach((r) => r.flush(mockCiudadList));
    tick(500);
    const backSpy = spyOn(component, 'back').and.callThrough();
    const redirectToEditSpy = spyOn(
      component,
      'redirectToEdit'
    ).and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    pageFormComponent.triggerEventHandler('editClick', null);
    tick(1);
    expect(backSpy).toHaveBeenCalled();
    expect(redirectToEditSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
