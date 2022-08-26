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
import { FleteFormInfoComponent } from 'src/app/flete/flete-form-info/flete-form-info.component';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { mockFlete1, mockFlete2 } from 'src/app/interfaces/flete';
import { mockFleteDestinatarioList } from 'src/app/interfaces/flete-destinatario';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { mockProductoList } from 'src/app/interfaces/producto';
import { mockRemitenteList } from 'src/app/interfaces/remitente';
import { mockTipoAnticipoList } from 'src/app/interfaces/tipo-anticipo';
import { mockTipoCargaList } from 'src/app/interfaces/tipo-carga';
import { mockTipoConceptoComplementoList } from 'src/app/interfaces/tipo-concepto-complemento';
import { mockTipoConceptoDescuentoList } from 'src/app/interfaces/tipo-concepto-descuento';
import { mockUnidadList } from 'src/app/interfaces/unidad';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { FleteService } from 'src/app/services/flete.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { FleteFormAnticiposComponent } from '../flete-form-anticipos/flete-form-anticipos.component';
import { FleteFormComplementosComponent } from '../flete-form-complementos/flete-form-complementos.component';
import { FleteFormCondicionAfectadoComponent } from '../flete-form-condicion-afectado/flete-form-condicion-afectado.component';
import { FleteFormCondicionComponent } from '../flete-form-condicion/flete-form-condicion.component';
import { FleteFormDescuentosComponent } from '../flete-form-descuentos/flete-form-descuentos.component';
import { FleteFormEmisionOrdenComponent } from '../flete-form-emision-orden/flete-form-emision-orden.component';
import { FleteFormMermaComponent } from '../flete-form-merma/flete-form-merma.component';
import { FleteFormTramoComponent } from '../flete-form-tramo/flete-form-tramo.component';
import { FleteFormComponent } from './flete-form.component';

describe('FleteFormComponent', () => {
  let component: FleteFormComponent;
  let fixture: ComponentFixture<FleteFormComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let fleteService: FleteService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const createRouter = {
    ...router,
    url: `flete/${m.FLETE}/${a.CREAR}`,
  };
  const editRouter = {
    ...router,
    url: `flete/${m.FLETE}/${a.EDITAR}/:id`,
  };
  const showRouter = {
    ...router,
    url: `flete/${m.FLETE}/${a.VER}`,
  };
  const id = mockFlete1.id;
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
  function formSetValue(component: FleteFormComponent): void {
    component.form.patchValue({
      info: {
        remitente_id: mockFlete1.remitente_id,
        producto_id: mockFlete1.producto_id,
        tipo_carga_id: mockFlete1.tipo_carga_id,
        numero_lote: mockFlete1.numero_lote,
        publicado: mockFlete1.publicado,
        es_subasta: mockFlete1.es_subasta,
      },
      tramo: {
        origen_id: mockFlete1.origen_id,
        origen_indicacion: mockFlete1.origen_indicacion,
        destino_id: mockFlete1.destino_id,
        destino_indicacion: mockFlete1.destino_indicacion,
        distancia: mockFlete1.distancia,
      },
      condicion: {
        condicion_cantidad: mockFlete1.condicion_cantidad,
        // inicio - Condiciones para el Gestor de Carga
        condicion_gestor_carga_moneda_id:
          mockFlete1.condicion_gestor_carga_moneda_id,
        condicion_gestor_carga_tarifa: mockFlete1.condicion_gestor_carga_tarifa,
        condicion_gestor_carga_unidad_id:
          mockFlete1.condicion_gestor_carga_unidad_id,
        // fin - Condiciones para el Gestor de Carga
        // inicio - Condiciones para el Propietario
        condicion_propietario_moneda_id:
          mockFlete1.condicion_propietario_moneda_id,
        condicion_propietario_tarifa: mockFlete1.condicion_propietario_tarifa,
        condicion_propietario_unidad_id:
          mockFlete1.condicion_propietario_unidad_id,
        // fin - Condiciones para el Propietario
      },
      merma: {
        // inicio - Mermas para el Gestor de Carga
        merma_gestor_carga_valor: mockFlete1.merma_gestor_carga_valor,
        merma_gestor_carga_moneda_id: mockFlete1.merma_gestor_carga_moneda_id,
        merma_gestor_carga_unidad_id: mockFlete1.merma_gestor_carga_unidad_id,
        merma_gestor_carga_es_porcentual:
          mockFlete1.merma_gestor_carga_es_porcentual,
        merma_gestor_carga_tolerancia: mockFlete1.merma_gestor_carga_tolerancia,
        // fin - Mermas para el Gestor de Carga
        // inicio - Mermas para el Propietario
        merma_propietario_valor: mockFlete1.merma_propietario_valor,
        merma_propietario_moneda_id: mockFlete1.merma_propietario_moneda_id,
        merma_propietario_unidad_id: mockFlete1.merma_propietario_unidad_id,
        merma_propietario_es_porcentual:
          mockFlete1.merma_propietario_es_porcentual,
        merma_propietario_tolerancia: mockFlete1.merma_propietario_tolerancia,
        // fin - Mermas para el Propietario
      },
      emision_orden: {
        emision_orden_texto_legal: mockFlete1.emision_orden_texto_legal,
        emision_orden_detalle: mockFlete1.emision_orden_detalle,
        destinatarios: mockFlete1.destinatarios,
      },
      vigencia_anticipos: mockFlete1.vigencia_anticipos,
      anticipos: [],
      complementos: [],
      descuentos: [],
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
            path: `flete/${m.FLETE}/${a.CREAR}`,
            component: FleteFormComponent,
          },
          {
            path: `flete/${m.FLETE}/${a.EDITAR}`,
            component: FleteFormComponent,
          },
          { path: `flete/${m.FLETE}/${a.VER}`, component: FleteFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        FleteService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
      declarations: [
        FleteFormComponent,
        FleteFormAnticiposComponent,
        FleteFormComplementosComponent,
        FleteFormCondicionComponent,
        FleteFormCondicionAfectadoComponent,
        FleteFormDescuentosComponent,
        FleteFormEmisionOrdenComponent,
        FleteFormInfoComponent,
        FleteFormMermaComponent,
        FleteFormTramoComponent,
      ],
    }).compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FleteFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController
      .match(`${environment.api}/remitente/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockRemitenteList));
    httpController
      .match(`${environment.api}/centro_operativo/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockCentroOperativoList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    httpController
      .match(`${environment.api}/tipo_carga/`)
      .forEach((r) => r.flush(mockTipoCargaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/unidad/`)
      .forEach((r) => r.flush(mockUnidadList));
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    httpController
      .match(`${environment.api}/tipo_concepto_complemento/`)
      .forEach((r) => r.flush(mockTipoConceptoComplementoList));
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete1.remitente_id}/${mockFlete1.origen_id}/${mockFlete1.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
    const req = httpController.expectOne(`${environment.api}/flete/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockFlete1);
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
    fixture = TestBed.createComponent(FleteFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/remitente/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockRemitenteList));
    httpController
      .match(`${environment.api}/centro_operativo/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockCentroOperativoList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    httpController
      .match(`${environment.api}/tipo_carga/`)
      .forEach((r) => r.flush(mockTipoCargaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/unidad/`)
      .forEach((r) => r.flush(mockUnidadList));
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    httpController
      .match(`${environment.api}/tipo_concepto_complemento/`)
      .forEach((r) => r.flush(mockTipoConceptoComplementoList));
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    formSetValue(component);
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', true);
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete1.remitente_id}/${mockFlete1.origen_id}/${mockFlete1.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
    const req = httpController.expectOne(`${environment.api}/flete/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockFlete1);
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
    fixture = TestBed.createComponent(FleteFormComponent);
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
    fixture = TestBed.createComponent(FleteFormComponent);
    fleteService = TestBed.inject(FleteService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(fleteService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/flete/${id}`)
      .forEach((r) => r.flush(mockFlete1));
    httpController
      .match(`${environment.api}/remitente/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockRemitenteList));
    httpController
      .match(`${environment.api}/centro_operativo/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockCentroOperativoList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    httpController
      .match(`${environment.api}/tipo_carga/`)
      .forEach((r) => r.flush(mockTipoCargaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/unidad/`)
      .forEach((r) => r.flush(mockUnidadList));
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    httpController
      .match(`${environment.api}/tipo_concepto_complemento/`)
      .forEach((r) => r.flush(mockTipoConceptoComplementoList));
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete1.remitente_id}/${mockFlete1.origen_id}/${mockFlete1.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
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
    httpController.match(`${environment.api}/flete/${id}`).forEach((req) => {
      expect(req.request.method).toBe('PUT');
      req.flush(mockFlete1);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/flete/${id}`)
      .forEach((r) => r.flush(mockFlete1));
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete1.remitente_id}/${mockFlete1.origen_id}/${mockFlete1.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(FleteFormComponent);
    fleteService = TestBed.inject(FleteService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const dialogSpy = spyOn(
      (component as any).dialog,
      'changeStatusConfirm'
    ).and.returnValue(dialogRefSpyObj);
    const cancelSpy = spyOn(component, 'cancelar').and.callThrough();
    const getByIdSpy = spyOn(fleteService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController
      .match(`${environment.api}/flete/${id}`)
      .forEach((r) => r.flush(mockFlete2));
    httpController
      .match(`${environment.api}/remitente/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockRemitenteList));
    httpController
      .match(`${environment.api}/centro_operativo/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockCentroOperativoList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    httpController
      .match(`${environment.api}/tipo_carga/`)
      .forEach((r) => r.flush(mockTipoCargaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/unidad/`)
      .forEach((r) => r.flush(mockUnidadList));
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    httpController
      .match(`${environment.api}/tipo_concepto_complemento/`)
      .forEach((r) => r.flush(mockTipoConceptoComplementoList));
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete2.remitente_id}/${mockFlete2.origen_id}/${mockFlete2.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    pageFormComponent.triggerEventHandler('inactiveClick', null);
    httpController
      .match(`${environment.api}/flete/${id}/cancel`)
      .forEach((r) => r.flush(mockFlete2));
    flush();
    tick(1);
    expect(cancelSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    tick();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FleteFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/flete/${id}`)
      .forEach((r) => r.flush(mockFlete1));
    httpController
      .match(`${environment.api}/remitente/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockRemitenteList));
    httpController
      .match(`${environment.api}/centro_operativo/gestor_cuenta_id`)
      .forEach((r) => r.flush(mockCentroOperativoList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    httpController
      .match(`${environment.api}/tipo_carga/`)
      .forEach((r) => r.flush(mockTipoCargaList));
    httpController
      .match(`${environment.api}/moneda/`)
      .forEach((r) => r.flush(mockMonedaList));
    httpController
      .match(`${environment.api}/unidad/`)
      .forEach((r) => r.flush(mockUnidadList));
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    httpController
      .match(`${environment.api}/tipo_concepto_complemento/`)
      .forEach((r) => r.flush(mockTipoConceptoComplementoList));
    httpController
      .match(`${environment.api}/tipo_concepto_descuento/`)
      .forEach((r) => r.flush(mockTipoConceptoDescuentoList));
    httpController
      .match(
        `${environment.api}/flete/destinatarios/${mockFlete1.remitente_id}/${mockFlete1.origen_id}/${mockFlete1.destino_id}`
      )
      .forEach((r) => r.flush(mockFleteDestinatarioList));
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
