import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import {
  ComponentFixture,
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
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockComposicionJuridicaList } from 'src/app/interfaces/composicion-juridica';
import { mockRemitenteList } from 'src/app/interfaces/remitente';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { RemitenteService } from 'src/app/services/remitente.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { addContactoInFormByList } from 'src/app/utils/form-field-test';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { RemitenteFormComponent } from './remitente-form.component';

describe('RemitenteFormComponent', () => {
  let component: RemitenteFormComponent;
  let fixture: ComponentFixture<RemitenteFormComponent>;
  let httpController: HttpTestingController;
  let remitenteService: RemitenteService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const remitente = mockRemitenteList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `entities/${m.REMITENTE}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `entities/${m.REMITENTE}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `entities/${m.REMITENTE}/${a.VER}`,
  };
  const id = remitente.id;
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
    component: RemitenteFormComponent,
    logo: string | null = null
  ): void {
    component.form.patchValue({
      info: {
        alias: 'Alias',
        nombre: remitente.nombre,
        nombre_corto: remitente.nombre_corto,
        tipo_documento_id: remitente.tipo_documento_id,
        numero_documento: remitente.numero_documento,
        digito_verificador: remitente.digito_verificador,
        composicion_juridica_id: remitente.composicion_juridica_id,
        telefono: remitente.telefono,
        email: remitente.email,
        pagina_web: remitente.pagina_web,
        info_complementaria: remitente.info_complementaria,
        logo,
      },
      contactos: [],
      geo: {
        ciudad_id: remitente.ciudad_id,
        latitud: remitente.latitud,
        longitud: remitente.longitud,
        direccion: remitente.direccion,
      },
    });
    addContactoInFormByList(
      component.form.get('contactos'),
      remitente.contactos
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: `entities/${m.REMITENTE}/${a.CREAR}`,
            component: RemitenteFormComponent,
          },
          {
            path: `entities/${m.REMITENTE}/${a.EDITAR}`,
            component: RemitenteFormComponent,
          },
          {
            path: `entities/${m.REMITENTE}/${a.VER}`,
            component: RemitenteFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        RemitenteService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [RemitenteFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RemitenteFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    // httpController
    //   .expectOne(`${environment.api}/ciudad/`)
    //   .flush(mockCiudadList);
    const req = httpController.expectOne(`${environment.api}/remitente/`);
    expect(req.request.method).toBe('POST');
    req.flush(remitente);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RemitenteFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    // httpController
    //   .expectOne(`${environment.api}/ciudad/`)
    //   .flush(mockCiudadList);
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', null);
    const req = httpController.expectOne(`${environment.api}/remitente/`);
    expect(req.request.method).toBe('POST');
    req.flush(remitente);
    flush();
    tick();
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(RemitenteFormComponent);
    remitenteService = TestBed.inject(RemitenteService);
    component = fixture.componentInstance;
    const fileSpy = spyOnProperty(component, 'file').and.returnValue(fakeFile);
    const getByIdSpy = spyOn(remitenteService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/remitente/${id}`)
      .flush(remitente);
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    // httpController
    //   .expectOne(`${environment.api}/ciudad/`)
    //   .flush(mockCiudadList);
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
    httpController
      .match(`${environment.api}/remitente/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(remitente);
      });
    httpController
      .match(`${environment.api}/ciudad/${remitente.ciudad?.localidad_id}`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    httpController
      .match(`${environment.api}/remitente/${id}`)
      .forEach((r) => r.flush(remitente));
    httpController
      .match(`${environment.api}/ciudad/${remitente.ciudad?.localidad_id}`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    expect(fileSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RemitenteFormComponent);
    remitenteService = TestBed.inject(RemitenteService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(remitenteService, 'getById').and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .expectOne(`${environment.api}/remitente/${id}`)
      .flush(mockRemitenteList[1]);
    // httpController
    //   .expectOne(`${environment.api}/ciudad/`)
    //   .flush(mockCiudadList);
    flush();
    expect(getByIdSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    fixture = TestBed.createComponent(RemitenteFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
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
  }));
});
