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
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockComposicionJuridicaList } from 'src/app/interfaces/composicion-juridica';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockProveedorList } from 'src/app/interfaces/proveedor';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { addContactoInFormByList } from 'src/app/utils/form-field-test';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { ProveedorFormComponent } from './proveedor-form.component';

describe('ProveedorFormComponent', () => {
  let component: ProveedorFormComponent;
  let fixture: ComponentFixture<ProveedorFormComponent>;
  let httpController: HttpTestingController;
  let proveedorService: ProveedorService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  const proveedor = mockProveedorList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `entities/${m.PROVEEDOR}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `entities/${m.PROVEEDOR}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `entities/${m.PROVEEDOR}/${a.VER}`,
  };
  const id = proveedor.id;
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
    component: ProveedorFormComponent,
    logo: string | null = null
  ): void {
    component.form.patchValue({
      info: {
        alias: 'Alias',
        nombre: proveedor.nombre,
        nombre_corto: proveedor.nombre_corto,
        tipo_documento_id: proveedor.tipo_documento_id,
        numero_documento: proveedor.numero_documento,
        digito_verificador: proveedor.digito_verificador,
        composicion_juridica_id: proveedor.composicion_juridica_id,
        telefono: proveedor.telefono,
        email: proveedor.email,
        pagina_web: proveedor.pagina_web,
        info_complementaria: proveedor.info_complementaria,
        logo,
      },
      contactos: [],
      geo: {
        ciudad_id: proveedor.ciudad_id,
        latitud: proveedor.latitud,
        longitud: proveedor.longitud,
        direccion: proveedor.direccion,
      },
    });
    addContactoInFormByList(
      component.form.get('contactos'),
      proveedor.contactos
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
            path: `entities/${m.PROVEEDOR}/${a.CREAR}`,
            component: ProveedorFormComponent,
          },
          {
            path: `entities/${m.PROVEEDOR}/${a.EDITAR}`,
            component: ProveedorFormComponent,
          },
          {
            path: `entities/${m.PROVEEDOR}/${a.VER}`,
            component: ProveedorFormComponent,
          },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        ProveedorService,
        ComposicionJuridicaService,
        TipoDocumentoService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [ProveedorFormComponent],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
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
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
    const req = httpController.expectOne(`${environment.api}/proveedor/`);
    expect(req.request.method).toBe('POST');
    req.flush(proveedor);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
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
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', null);
    const req = httpController.expectOne(`${environment.api}/proveedor/`);
    expect(req.request.method).toBe('POST');
    req.flush(proveedor);
    flush();
    tick();
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
    proveedorService = TestBed.inject(ProveedorService);
    component = fixture.componentInstance;
    const fileSpy = spyOnProperty(component, 'file').and.returnValue(fakeFile);
    const getByIdSpy = spyOn(proveedorService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/proveedor/${id}`)
      .flush(proveedor);
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
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
      .match(`${environment.api}/proveedor/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(proveedor);
      });
    flush();
    httpController
      .match(`${environment.api}/proveedor/${id}`)
      .forEach((r) => r.flush(proveedor));
    httpController
      .match(`${environment.api}/localidad/${proveedor.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/${proveedor.ciudad?.localidad_id}/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    expect(fileSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
    proveedorService = TestBed.inject(ProveedorService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(proveedorService, 'getById').and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .expectOne(`${environment.api}/proveedor/${id}`)
      .flush(mockProveedorList[1]);
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
    flush();
    expect(getByIdSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
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

  it('should redirect to create punto-venta in create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const dialogSpy = spyOn(
      (component as any).dialog,
      'confirmation'
    ).and.returnValue(dialogRefSpyObj);
    const createPuntoVentaSpy = spyOn(
      component,
      'createPuntoVenta'
    ).and.callThrough();
    fixture.detectChanges();
    tick();
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
    flush();
    formSetValue(component, 'logo');
    const createPuntoVentaButton = fixture.debugElement.query(
      By.css('.create-punto-venta')
    );
    createPuntoVentaButton.triggerEventHandler(
      'click',
      new MouseEvent('click')
    );
    tick();
    httpController.match(`${environment.api}/proveedor/`).forEach((req) => {
      expect(req.request.method).toBe('POST');
      req.flush(proveedor);
    });
    httpController
      .match(`${environment.api}/localidad/${proveedor.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/${proveedor.ciudad?.localidad_id}/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    expect(createPuntoVentaSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    // expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
    discardPeriodicTasks();
  }));

  it('should redirect to create punto-venta in edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
    component = fixture.componentInstance;
    const createPuntoVentaSpy = spyOn(
      component,
      'createPuntoVenta'
    ).and.callThrough();
    fixture.detectChanges();
    tick();
    const createPuntoVentaButton = fixture.debugElement.query(
      By.css('.create-punto-venta')
    );
    createPuntoVentaButton.triggerEventHandler(
      'click',
      new MouseEvent('click')
    );
    tick();
    expect(createPuntoVentaSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should redirect to create punto-venta in edit view hasChange = true', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(ProveedorFormComponent);
    proveedorService = TestBed.inject(ProveedorService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(proveedorService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const dialogSpy = spyOn(
      (component as any).dialog,
      'confirmation'
    ).and.returnValue(dialogRefSpyObj);
    const createPuntoVentaSpy = spyOn(
      component,
      'createPuntoVenta'
    ).and.callThrough();
    fixture.detectChanges();
    httpController
      .expectOne(`${environment.api}/proveedor/${id}`)
      .flush(proveedor);
    httpController
      .expectOne(`${environment.api}/composicion_juridica/`)
      .flush(mockComposicionJuridicaList);
    httpController
      .expectOne(`${environment.api}/tipo_documento/`)
      .flush(mockTipoDocumentoList);
    httpController
      .expectOne(`${environment.api}/ciudad/`)
      .flush(mockCiudadList);
    flush();
    formSetValue(component, 'logo');
    component.info.controls['telefono'].setValue(proveedor.telefono.trim());
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    component.hasChange = true;
    const createPuntoVentaButton = fixture.debugElement.query(
      By.css('.create-punto-venta')
    );
    createPuntoVentaButton.triggerEventHandler(
      'click',
      new MouseEvent('click')
    );
    tick();
    httpController
      .match(`${environment.api}/proveedor/${id}`)
      .forEach((req) => {
        expect(req.request.method).toBe('PUT');
        req.flush(proveedor);
      });
    flush();
    httpController
      .match(`${environment.api}/proveedor/${id}`)
      .forEach((r) => r.flush(proveedor));
    httpController
      .match(`${environment.api}/localidad/${proveedor.ciudad?.pais_id}/`)
      .forEach((r) => r.flush(mockLocalidadList));
    httpController
      .match(`${environment.api}/ciudad/${proveedor.ciudad?.localidad_id}/`)
      .forEach((r) => r.flush(mockCiudadList));
    flush();
    expect(createPuntoVentaSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    // expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
