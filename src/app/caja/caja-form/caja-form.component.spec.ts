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
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCaja1, mockCaja2 } from 'src/app/interfaces/caja';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { CajaService } from 'src/app/services/caja.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { CajaFormComponent } from './caja-form.component';

describe('CajaFormComponent', () => {
  let component: CajaFormComponent;
  let fixture: ComponentFixture<CajaFormComponent>;
  let httpController: HttpTestingController;
  let cajaService: CajaService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `caja/${m.CAJA}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `caja/${m.CAJA}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `caja/${m.CAJA}/${a.VER}`,
  };
  const id = mockCaja1.id;
  const route = {
    snapshot: {
      params: {
        id,
      },
      queryParams: {},
    },
  };
  const createRoute = {
    snapshot: {
      params: {},
      queryParams: {},
    },
  };
  const createWithBackUrlRoute = {
    snapshot: {
      params: {},
      queryParams: { backUrl: '/' },
    },
  };
  function formSetValue(component: CajaFormComponent): void {
    component.form.patchValue({
      nombre: mockCaja1.nombre,
      moneda_id: mockCaja1.moneda_id,
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
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: `caja/${m.CAJA}/${a.CREAR}`, component: CajaFormComponent },
          { path: `caja/${m.CAJA}/${a.EDITAR}`, component: CajaFormComponent },
          { path: `caja/${m.CAJA}/${a.VER}`, component: CajaFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        CajaService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [CajaFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CajaFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    const req = httpController.expectOne(`${environment.api}/caja/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCaja1);
    tick();
    flush();
    expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CajaFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/caja/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCaja1);
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
    fixture = TestBed.createComponent(CajaFormComponent);
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
    fixture = TestBed.createComponent(CajaFormComponent);
    cajaService = TestBed.inject(CajaService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(cajaService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/caja/${id}`)
      .forEach((r) => r.flush(mockCaja1));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    flush();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    // formSetValue(component);
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.match(`${environment.api}/caja/${id}`).forEach((req) => {
      expect(req.request.method).toBe('PUT');
      req.flush(mockCaja1);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/caja/${id}`)
      .forEach((r) => r.flush(mockCaja1));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(CajaFormComponent);
    cajaService = TestBed.inject(CajaService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const getByIdSpy = spyOn(cajaService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/caja/${id}`)
      .forEach((r) => r.flush(mockCaja2));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    pageFormComponent.triggerEventHandler('inactiveClick', null);
    flush();
    tick(1);
    expect(submitSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CajaFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/caja/${id}`)
      .forEach((r) => r.flush(mockCaja1));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
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
