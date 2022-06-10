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
import { of } from 'rxjs';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCargoList } from 'src/app/interfaces/cargo';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { SeleccionableFormComponent } from './seleccionable-form.component';
import { SeleccionableFormService } from './seleccionable-form.service';

describe('SeleccionableFormComponent', () => {
  let component: SeleccionableFormComponent;
  let fixture: ComponentFixture<SeleccionableFormComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let service: SeleccionableFormService;
  let seleccionableService: SeleccionableService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const modelo = m.CARGO;
  const mockCargo1 = mockCargoList[0];
  const mockCargo2 = mockCargoList[1];
  const submodule = 'Cargo';
  const changeStatusMsg = 'al Cargo';
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `config/${modelo}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `config/${modelo}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `config/${modelo}/${a.VER}`,
  };
  const id = mockCargo1.id;
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
  function formSetValue(component: SeleccionableFormComponent): void {
    component.form.patchValue({
      descripcion: mockCargo1.descripcion,
      gestor_carga_id: null, // mockCargo1.gestor_carga_id,
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
            path: `config/${modelo}/${a.CREAR}`,
            component: SeleccionableFormComponent,
          },
          {
            path: `config/${modelo}/${a.EDITAR}`,
            component: SeleccionableFormComponent,
          },
          {
            path: `config/${modelo}/${a.VER}`,
            component: SeleccionableFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        SeleccionableService,
        SeleccionableFormService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [SeleccionableFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SeleccionableFormService);
    fixture = TestBed.createComponent(SeleccionableFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(service, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('backClick', true);
    // httpController
    //   .match(`${environment.api}/moneda/`)
    //   .forEach((r) => r.flush(mockMonedaList));
    const req = httpController.expectOne(`${environment.api}/${modelo}/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCargo1);
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
    fixture = TestBed.createComponent(SeleccionableFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    // httpController
    //   .match(`${environment.api}/moneda/`)
    //   .forEach((r) => r.flush(mockMonedaList));
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/${modelo}/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCargo1);
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
    fixture = TestBed.createComponent(SeleccionableFormComponent);
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
    fixture = TestBed.createComponent(SeleccionableFormComponent);
    service = TestBed.inject(SeleccionableFormService);
    seleccionableService = TestBed.inject(SeleccionableService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    const submitSpy = spyOn(service, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockCargo1));
    // httpController
    //   .match(`${environment.api}/moneda/`)
    //   .forEach((r) => r.flush(mockMonedaList));
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
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(mockCargo1);
      });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockCargo1));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(SeleccionableFormComponent);
    service = TestBed.inject(SeleccionableFormService);
    seleccionableService = TestBed.inject(SeleccionableService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const dialogSpy = spyOn(
      (service as any).dialog,
      'changeStatusConfirm'
    ).and.returnValue(dialogRefSpyObj);
    const activeSpy = spyOn(component, 'active').and.callThrough();
    const inactiveSpy = spyOn(component, 'inactive').and.callThrough();
    const getByIdSpy = spyOn(seleccionableService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockCargo2));
    // httpController
    //   .match(`${environment.api}/moneda/`)
    //   .forEach((r) => r.flush(mockMonedaList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    pageFormComponent.triggerEventHandler('activeClick', null);
    pageFormComponent.triggerEventHandler('inactiveClick', null);
    httpController
      .match(`${environment.api}/${modelo}/${id}/active`)
      .forEach((r) => r.flush(mockCargo2));
    httpController
      .match(`${environment.api}/${modelo}/${id}/inactive`)
      .forEach((r) => r.flush(mockCargo2));
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
    fixture = TestBed.createComponent(SeleccionableFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/${modelo}/${id}`)
      .forEach((r) => r.flush(mockCargo1));
    // httpController
    //   .match(`${environment.api}/moneda/`)
    //   .forEach((r) => r.flush(mockMonedaList));
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
