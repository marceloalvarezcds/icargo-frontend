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
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockBanco1, mockBanco2 } from 'src/app/interfaces/banco';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { BancoService } from 'src/app/services/banco.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { BancoFormComponent } from './banco-form.component';

describe('BancoFormComponent', () => {
  let component: BancoFormComponent;
  let fixture: ComponentFixture<BancoFormComponent>;
  let httpController: HttpTestingController;
  let bancoService: BancoService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `banco/${m.BANCO}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `banco/${m.BANCO}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `banco/${m.BANCO}/${a.VER}`,
  };
  const id = mockBanco1.id;
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
  function formSetValue(component: BancoFormComponent): void {
    component.form.patchValue({
      numero_cuenta: mockBanco1.numero_cuenta,
      titular: mockBanco1.titular,
      nombre: mockBanco1.nombre,
      moneda_id: mockBanco1.moneda_id,
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
          {
            path: `banco/${m.BANCO}/${a.CREAR}`,
            component: BancoFormComponent,
          },
          {
            path: `banco/${m.BANCO}/${a.EDITAR}`,
            component: BancoFormComponent,
          },
          { path: `banco/${m.BANCO}/${a.VER}`, component: BancoFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        BancoService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [BancoFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BancoFormComponent);
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
    const req = httpController.expectOne(`${environment.api}/banco/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBanco1);
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
    fixture = TestBed.createComponent(BancoFormComponent);
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
    const req = httpController.expectOne(`${environment.api}/banco/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBanco1);
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
    fixture = TestBed.createComponent(BancoFormComponent);
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
    fixture = TestBed.createComponent(BancoFormComponent);
    bancoService = TestBed.inject(BancoService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(bancoService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/banco/${id}`)
      .forEach((r) => r.flush(mockBanco1));
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
    httpController.match(`${environment.api}/banco/${id}`).forEach((req) => {
      expect(req.request.method).toBe('PUT');
      req.flush(mockBanco1);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/banco/${id}`)
      .forEach((r) => r.flush(mockBanco1));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(BancoFormComponent);
    bancoService = TestBed.inject(BancoService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const getByIdSpy = spyOn(bancoService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/banco/${id}`)
      .forEach((r) => r.flush(mockBanco2));
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
    fixture = TestBed.createComponent(BancoFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/banco/${id}`)
      .forEach((r) => r.flush(mockBanco1));
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
