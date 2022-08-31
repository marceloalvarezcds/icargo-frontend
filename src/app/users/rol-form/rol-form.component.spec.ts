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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockGestorCargaList } from 'src/app/interfaces/gestor-carga';
import { mockPermisoList } from 'src/app/interfaces/permiso';
import { mockRolList } from 'src/app/interfaces/rol';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { RolService } from 'src/app/services/rol.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { RolFormComponent } from './rol-form.component';
import { RolFormService } from './rol-form.service';

describe('RolFormComponent', () => {
  let component: RolFormComponent;
  let fixture: ComponentFixture<RolFormComponent>;
  let httpController: HttpTestingController;
  let service: RolFormService;
  let seleccionableService: RolService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const modelo = m.ROL;
  const mockRol1 = mockRolList[0];
  const mockRol2 = mockRolList[1];
  const submodule = 'Rol';
  const changeStatusMsg = 'al Rol';
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `users/${modelo}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `users/${modelo}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `users/${modelo}/${a.VER}`,
  };
  const id = mockRol1.id;
  const data = {
    modelo,
    submodule,
    changeStatusMsg,
  };
  const route = {
    snapshot: {
      data,
      params: {
        id,
      },
      queryParams: {},
    },
  };
  const createRoute = {
    snapshot: {
      data,
      params: {},
      queryParams: {},
    },
  };
  const createWithBackUrlRoute = {
    snapshot: {
      data,
      params: {},
      queryParams: { backUrl: '/' },
    },
  };
  function formSetValue(component: RolFormComponent): void {
    component.form.patchValue({
      descripcion: mockRol1.descripcion,
      gestor_carga_id: mockRol1.gestor_carga_id,
      permisos: mockRol1.permisos,
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        DirectivesModule,
        FormFieldModule,
        MaterialModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: `users/${modelo}/${a.CREAR}`,
            component: RolFormComponent,
          },
          {
            path: `users/${modelo}/${a.EDITAR}`,
            component: RolFormComponent,
          },
          {
            path: `users/${modelo}/${a.VER}`,
            component: RolFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        RolService,
        RolFormService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [RolFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RolFormService);
    fixture = TestBed.createComponent(RolFormComponent);
    component = fixture.componentInstance;
    // const submitSpy = spyOn(service, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/permiso/`)
      .forEach((r) => r.flush(mockPermisoList));
    const req = httpController.expectOne(`${environment.api}/${modelo}/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRol1);
    tick();
    flush();
    // expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RolFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/permiso/`)
      .forEach((r) => r.flush(mockPermisoList));
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/${modelo}/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRol1);
    tick();
    flush();
    expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open create view with backUrl', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: createWithBackUrlRoute,
    });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    fixture = TestBed.createComponent(RolFormComponent);
    component = fixture.componentInstance;
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    expect(backSpy).toHaveBeenCalled();
  });

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(RolFormComponent);
    service = TestBed.inject(RolFormService);
    seleccionableService = TestBed.inject(RolService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    const submitSpy = spyOn(service, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockRol1));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/permiso/`)
      .forEach((r) => r.flush(mockPermisoList));
    flush();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    // expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    // formSetValue(component);
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(mockRol1);
      });
    flush();
    // expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockRol1));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(RolFormComponent);
    service = TestBed.inject(RolFormService);
    seleccionableService = TestBed.inject(RolService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    // const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockRol2));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/permiso/`)
      .forEach((r) => r.flush(mockPermisoList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    flush();
    tick(1);
    // expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RolFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockRol1));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/permiso/`)
      .forEach((r) => r.flush(mockPermisoList));
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
