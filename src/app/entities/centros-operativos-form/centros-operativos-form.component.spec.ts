import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
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
import { mockCentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { mockCentroOperativoClasificacionList } from 'src/app/interfaces/centro-operativo-clasificacion';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { UserService } from 'src/app/services/user.service';
import { addContactoInFormByList } from 'src/app/utils/form-field-test';
import { fakeFileList, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { CentrosOperativosFormComponent } from './centros-operativos-form.component';

@Component({ template: '' })
class TestComponent {}

describe('CentrosOperativosFormComponent', () => {
  let component: CentrosOperativosFormComponent;
  let fixture: ComponentFixture<CentrosOperativosFormComponent>;
  let httpController: HttpTestingController;
  let centroOperativoService: CentroOperativoService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const centroOperativo = mockCentroOperativoList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `entities/${m.CENTRO_OPERATIVO}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `entities/${m.CENTRO_OPERATIVO}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `entities/${m.CENTRO_OPERATIVO}/${a.VER}`,
  };
  const id = centroOperativo.id;
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
    component: CentrosOperativosFormComponent,
    logo: string | null = null
  ): void {
    component.form.patchValue({
      info: {
        alias: 'Alias',
        nombre: centroOperativo.nombre,
        nombre_corto: centroOperativo.nombre_corto,
        clasificacion_id: centroOperativo.clasificacion_id,
        telefono: centroOperativo.telefono,
        email: centroOperativo.email,
        pagina_web: centroOperativo.pagina_web,
        logo,
      },
      contactos: [],
      geo: {
        pais_id: centroOperativo.ciudad?.localidad.pais_id,
        localidad_id: centroOperativo.ciudad?.localidad_id,
        ciudad_id: centroOperativo.ciudad_id,
        latitud: centroOperativo.latitud,
        longitud: centroOperativo.longitud,
        direccion: centroOperativo.direccion,
      },
    });
    addContactoInFormByList(
      component.form.get('contactos'),
      centroOperativo.contactos
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
            path: `entities/${m.CENTRO_OPERATIVO}/${a.CREAR}`,
            component: TestComponent,
          },
          {
            path: `entities/${m.CENTRO_OPERATIVO}/${a.EDITAR}`,
            component: TestComponent,
          },
          {
            path: `entities/${m.CENTRO_OPERATIVO}/${a.VER}`,
            component: TestComponent,
          },
        ]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        CentroOperativoService,
        CentroOperativoClasificacionService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [CentrosOperativosFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    component = fixture.componentInstance;
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    const fileInput: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.files = fakeFileList;
    fileInput.dispatchEvent(new Event('change'));
    expect(component).toBeTruthy();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .expectOne(`${environment.api}/centro_operativo_clasificacion/`)
      .flush(mockCentroOperativoClasificacionList);
    const req = httpController.expectOne(
      `${environment.api}/centro_operativo/`
    );
    expect(req.request.method).toBe('POST');
    req.flush(centroOperativo);
    flush();
    expect(fileChangeSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .expectOne(`${environment.api}/centro_operativo_clasificacion/`)
      .flush(mockCentroOperativoClasificacionList);
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', null);
    const req = httpController.expectOne(
      `${environment.api}/centro_operativo/`
    );
    expect(req.request.method).toBe('POST');
    req.flush(centroOperativo);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    centroOperativoService = TestBed.inject(CentroOperativoService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(
      centroOperativoService,
      'getById'
    ).and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/centro_operativo/${id}`)
      .flush(centroOperativo);
    httpController
      .expectOne(`${environment.api}/centro_operativo_clasificacion/`)
      .flush(mockCentroOperativoClasificacionList);
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
      .match(`${environment.api}/centro_operativo/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(centroOperativo);
      });
    flush();
    httpController
      .match(`${environment.api}/centro_operativo/${id}`)
      .forEach((r) => r.flush(centroOperativo));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    centroOperativoService = TestBed.inject(CentroOperativoService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(
      centroOperativoService,
      'getById'
    ).and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/centro_operativo_clasificacion/`)
      .flush(mockCentroOperativoClasificacionList);
    httpController
      .expectOne(`${environment.api}/centro_operativo/${id}`)
      .flush(mockCentroOperativoList[1]);
    flush();
    expect(getByIdSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    fixture.detectChanges();
    tick(500);
    const fileInput: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.dispatchEvent(new Event('change'));
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
    expect(fileChangeSpy).toHaveBeenCalled();
  }));
});
