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
import { mockRolList } from 'src/app/interfaces/rol';
import { mockUser, mockUser2, mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { UserFormComponent } from './user-form.component';
import { UserFormService } from './user-form.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let httpController: HttpTestingController;
  let service: UserFormService;
  let seleccionableService: UserService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const modelo = m.USER;
  const mockUser1 = mockUser;
  const submodule = 'User';
  const changeStatusMsg = 'al User';
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
  const id = mockUser1.id;
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
  function formSetValue(component: UserFormComponent): void {
    component.form.patchValue({
      first_name: mockUser1.first_name,
      last_name: mockUser1.last_name,
      usuario: mockUser1.username,
      email: mockUser1.email,
      contrasena: mockUser1.password,
      confirm_password: mockUser1.confirm_password,
      gestor_carga_id: mockUser1.gestor_carga_id,
      roles: mockUser1.roles,
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
            component: UserFormComponent,
          },
          {
            path: `users/${modelo}/${a.EDITAR}`,
            component: UserFormComponent,
          },
          {
            path: `users/${modelo}/${a.VER}`,
            component: UserFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        UserService,
        UserFormService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [UserFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserFormService);
    fixture = TestBed.createComponent(UserFormComponent);
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
      .match(`${environment.api}/rol/active_list`)
      .forEach((r) => r.flush(mockRolList));
    const req = httpController.expectOne(`${environment.api}/user/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser1);
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
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/rol/active_list`)
      .forEach((r) => r.flush(mockRolList));
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/user/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser1);
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
    fixture = TestBed.createComponent(UserFormComponent);
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
    fixture = TestBed.createComponent(UserFormComponent);
    service = TestBed.inject(UserFormService);
    seleccionableService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    const submitSpy = spyOn(service, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/user/${id}`)
      .forEach((r) => r.flush(mockUser1));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/rol/active_list`)
      .forEach((r) => r.flush(mockRolList));
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
    httpController.match(`${environment.api}/user/${id}`).forEach((req) => {
      expect(req.request.method).toBe('PUT');
      req.flush(mockUser1);
    });
    flush();
    // expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/user/${id}`)
      .forEach((r) => r.flush(mockUser1));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(UserFormComponent);
    service = TestBed.inject(UserFormService);
    seleccionableService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    // const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/user/${id}`)
      .forEach((r) => r.flush(mockUser2));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/rol/active_list`)
      .forEach((r) => r.flush(mockRolList));
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
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/user/${id}`)
      .forEach((r) => r.flush(mockUser1));
    httpController
      .match(`${environment.api}/gestor_carga`)
      .forEach((r) => r.flush(mockGestorCargaList));
    httpController
      .match(`${environment.api}/rol/active_list`)
      .forEach((r) => r.flush(mockRolList));
    flush();
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
