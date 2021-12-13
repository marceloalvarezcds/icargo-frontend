import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockSemiClasificacionList } from 'src/app/interfaces/semi-clasificacion';
import { mockSemi } from 'src/app/interfaces/semi';
import { mockTipoCargaList } from 'src/app/interfaces/tipo-carga';
import { mockTipoSemiList } from 'src/app/interfaces/tipo-semi';
import { mockMarcaSemiList } from 'src/app/interfaces/marca-semi';
import { mockUserAccount } from 'src/app/interfaces/user';
import { mockPropietarioList } from 'src/app/interfaces/propietario';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { SemiService } from 'src/app/services/semi.service';
import { TipoSemiService } from 'src/app/services/tipo-semi.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { SemiFormInfoComponent } from 'src/app/flota/semi-form-info/semi-form-info.component';
import { RegistroConduccionFormComponent } from 'src/app/flota/registro-conduccion-form/registro-conduccion-form.component';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { mockChoferList } from 'src/app/interfaces/chofer';
import { mockEnteEmisorAutomotorList } from 'src/app/interfaces/ente-emisor-automotor';
import { mockEnteEmisorTransporteList } from 'src/app/interfaces/ente-emisor-transporte';

import { SemiFormComponent } from './semi-form.component';

describe('SemiFormComponent', () => {
  let component: SemiFormComponent;
  let fixture: ComponentFixture<SemiFormComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  let semiService: SemiService;
  let userService: UserService;
  let pageFormComponent: DebugElement;
  let semiFormInfo: DebugElement;
  let habilitacionFormAutomotor: DebugElement;
  let habilitacionFormMunicipal: DebugElement;
  let habilitacionFormTransporte: DebugElement;
  const router = {
    navigate: jasmine.createSpy('navigate'),
  }
  const createRouter = {
    ...router, url: `flota/${m.CAMION}/${a.CREAR}`,
  }
  const editRouter = {
    ...router, url: `flota/${m.CAMION}/${a.EDITAR}/:id`,
  }
  const showRouter = {
    ...router, url: `flota/${m.CAMION}/${a.VER}`,
  }
  const id = mockSemi.id;
  const route = {
    snapshot: {
      params: {
        id,
      },
      queryParams: { },
    },
  };
  const createRoute = {
    snapshot: {
      params: { },
      queryParams: { },
    },
  };
  const createWithBackUrlRoute = {
    snapshot: {
      params: { },
      queryParams: { backUrl: '/' },
    },
  };
  function formSetValue(component: SemiFormComponent, fileUrl: string | null = null): void {
    component.form.setValue({
      info: {
        placa: mockSemi.placa,
        propietario_id: mockSemi.propietario_id,
        numero_chasis: mockSemi.numero_chasis,
        foto: fileUrl,
      },
      municipal: {
        pais_habilitacion_municipal_id: mockSemi.ciudad_habilitacion_municipal.localidad.pais_id,
        localidad_habilitacion_municipal_id: mockSemi.ciudad_habilitacion_municipal.localidad_id,
        ciudad_habilitacion_municipal_id: mockSemi.ciudad_habilitacion_municipal_id,
        numero_habilitacion_municipal: mockSemi.numero_habilitacion_municipal,
        vencimiento_habilitacion_municipal: mockSemi.vencimiento_habilitacion_municipal,
        foto_habilitacion_municipal_frente: fileUrl,
        foto_habilitacion_municipal_reverso: fileUrl,
      },
      transporte: {
        ente_emisor_transporte_id: mockSemi.ente_emisor_transporte_id,
        numero_habilitacion_transporte: mockSemi.numero_habilitacion_transporte,
        vencimiento_habilitacion_transporte: mockSemi.vencimiento_habilitacion_transporte,
        foto_habilitacion_transporte_frente: fileUrl,
        foto_habilitacion_transporte_reverso: fileUrl,
      },
      automotor: {
        ente_emisor_automotor_id: mockSemi.ente_emisor_automotor_id,
        titular_habilitacion_automotor: mockSemi.titular_habilitacion_automotor,
        foto_habilitacion_automotor_frente: fileUrl,
        foto_habilitacion_automotor_reverso: fileUrl,
      },
      detalle: {
        marca_id: mockSemi.marca_id,
        clasificacion_id: mockSemi.clasificacion_id,
        tipo_id: mockSemi.tipo_id,
        tipo_carga_id: mockSemi.tipo_carga_id,
        color_id: mockSemi.color_id,
        anho: mockSemi.anho,
      },
      capacidad: {
        bruto: mockSemi.bruto,
        tara: mockSemi.tara,
        largo: mockSemi.largo,
        alto: mockSemi.alto,
        ancho: mockSemi.ancho,
        volumen: mockSemi.volumen,
      },
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
          { path: `flota/${m.CAMION}/${a.CREAR}`, component: SemiFormComponent },
          { path: `flota/${m.CAMION}/${a.EDITAR}`, component: SemiFormComponent },
          { path: `flota/${m.CAMION}/${a.VER}`, component: SemiFormComponent },
        ]),
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        AuthService,
        UserService,
        PermisoPipe,
        SemiService,
        ComposicionJuridicaService,
        TipoSemiService,
        TipoRegistroService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router }
      ],
      declarations: [
        SemiFormComponent,
        SemiFormInfoComponent,
        RegistroConduccionFormComponent,
      ],
    })
    .compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SemiFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.match(`${environment.api}/propietario/gestor_cuenta/`).forEach(r => r.flush(mockPropietarioList));
    httpController.match(`${environment.api}/chofer/gestor_cuenta/`).forEach(r => r.flush(mockChoferList));
    httpController.match(`${environment.api}/ente_emisor_automotor/`).forEach(r => r.flush(mockEnteEmisorAutomotorList));
    httpController.match(`${environment.api}/ente_emisor_transporte/`).forEach(r => r.flush(mockEnteEmisorTransporteList));
    httpController.match(`${environment.api}/tipo_semi/`).forEach(r => r.flush(mockTipoSemiList));
    httpController.match(`${environment.api}/tipo_carga/`).forEach(r => r.flush(mockTipoCargaList));
    httpController.match(`${environment.api}/marca_semi/`).forEach(r => r.flush(mockMarcaSemiList));
    httpController.match(`${environment.api}/semi_clasificacion/`).forEach(r => r.flush(mockSemiClasificacionList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    const req = httpController.expectOne(`${environment.api}/semi/`)
    expect(req.request.method).toBe('POST');
    req.flush(mockSemi);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with submitEvent', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SemiFormComponent);
    component = fixture.componentInstance;
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.match(`${environment.api}/propietario/gestor_cuenta/`).forEach(r => r.flush(mockPropietarioList));
    httpController.match(`${environment.api}/chofer/gestor_cuenta/`).forEach(r => r.flush(mockChoferList));
    httpController.match(`${environment.api}/ente_emisor_automotor/`).forEach(r => r.flush(mockEnteEmisorAutomotorList));
    httpController.match(`${environment.api}/ente_emisor_transporte/`).forEach(r => r.flush(mockEnteEmisorTransporteList));
    httpController.match(`${environment.api}/tipo_semi/`).forEach(r => r.flush(mockTipoSemiList));
    httpController.match(`${environment.api}/tipo_carga/`).forEach(r => r.flush(mockTipoCargaList));
    httpController.match(`${environment.api}/marca_semi/`).forEach(r => r.flush(mockMarcaSemiList));
    httpController.match(`${environment.api}/semi_clasificacion/`).forEach(r => r.flush(mockSemiClasificacionList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('submitEvent', true);
    const req = httpController.expectOne(`${environment.api}/semi/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockSemi);
    flush();
    tick();
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open create view with backUrl', () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createWithBackUrlRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    fixture = TestBed.createComponent(SemiFormComponent);
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
    fixture = TestBed.createComponent(SemiFormComponent);
    semiService = TestBed.inject(SemiService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    const getByIdSpy = spyOn(semiService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    httpController.match(`${environment.api}/semi/${id}`).forEach(r => r.flush(mockSemi));
    httpController.match(`${environment.api}/propietario/gestor_cuenta/`).forEach(r => r.flush(mockPropietarioList));
    httpController.match(`${environment.api}/chofer/gestor_cuenta/`).forEach(r => r.flush(mockChoferList));
    httpController.match(`${environment.api}/ente_emisor_automotor/`).forEach(r => r.flush(mockEnteEmisorAutomotorList));
    httpController.match(`${environment.api}/ente_emisor_transporte/`).forEach(r => r.flush(mockEnteEmisorTransporteList));
    httpController.match(`${environment.api}/tipo_semi/`).forEach(r => r.flush(mockTipoSemiList));
    httpController.match(`${environment.api}/tipo_carga/`).forEach(r => r.flush(mockTipoCargaList));
    httpController.match(`${environment.api}/marca_semi/`).forEach(r => r.flush(mockMarcaSemiList));
    httpController.match(`${environment.api}/semi_clasificacion/`).forEach(r => r.flush(mockSemiClasificacionList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    flush();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    semiFormInfo = findElement(fixture, 'app-semi-form-info');
    habilitacionFormAutomotor = findElement(fixture, 'app-habilitacion-form-automotor');
    habilitacionFormMunicipal = findElement(fixture, 'app-habilitacion-form-municipal');
    habilitacionFormTransporte = findElement(fixture, 'app-habilitacion-form-transporte');
    pageFormComponent.triggerEventHandler('backClick', true);
    semiFormInfo.triggerEventHandler('fotoChange', fakeFile);
    habilitacionFormAutomotor.triggerEventHandler('fotoFrenteChange', fakeFile);
    habilitacionFormAutomotor.triggerEventHandler('fotoReversoChange', fakeFile);
    habilitacionFormMunicipal.triggerEventHandler('fotoFrenteChange', fakeFile);
    habilitacionFormMunicipal.triggerEventHandler('fotoReversoChange', fakeFile);
    habilitacionFormTransporte.triggerEventHandler('fotoFrenteChange', fakeFile);
    habilitacionFormTransporte.triggerEventHandler('fotoReversoChange', fakeFile);
    tick();
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    httpController.match(`${environment.api}/semi/${id}`).forEach(req => {
      expect(req.request.method).toBe('PUT');
      req.flush(mockSemi);
    });
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.match(`${environment.api}/semi/${id}`).forEach(r => r.flush(mockSemi));
    flush();
    tick();
    httpController.verify();
  }));

  it('should open edit view with alias null', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SemiFormComponent);
    semiService = TestBed.inject(SemiService);
    component = fixture.componentInstance;
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    const activeSpy = spyOn(component, 'active').and.callThrough();
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(dialogRefSpyObj);
    const inactiveSpy = spyOn(component, 'inactive').and.callThrough();
    const getByIdSpy = spyOn(semiService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    httpController.match(`${environment.api}/semi/${id}`).forEach(r => r.flush(mockSemi));
    httpController.match(`${environment.api}/propietario/gestor_cuenta/`).forEach(r => r.flush(mockPropietarioList));
    httpController.match(`${environment.api}/chofer/gestor_cuenta/`).forEach(r => r.flush(mockChoferList));
    httpController.match(`${environment.api}/ente_emisor_automotor/`).forEach(r => r.flush(mockEnteEmisorAutomotorList));
    httpController.match(`${environment.api}/ente_emisor_transporte/`).forEach(r => r.flush(mockEnteEmisorTransporteList));
    httpController.match(`${environment.api}/tipo_semi/`).forEach(r => r.flush(mockTipoSemiList));
    httpController.match(`${environment.api}/tipo_carga/`).forEach(r => r.flush(mockTipoCargaList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    flush();
    tick();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    pageFormComponent.triggerEventHandler('submitEvent', null);
    pageFormComponent.triggerEventHandler('activeClick', null);
    pageFormComponent.triggerEventHandler('inactiveClick', null);
    httpController.match(`${environment.api}/semi/${id}/active`).forEach(r => r.flush(mockSemi));
    httpController.match(`${environment.api}/semi/${id}/inactive`).forEach(r => r.flush(mockSemi));
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
    fixture = TestBed.createComponent(SemiFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/semi/${id}`).flush(mockSemi);
    httpController.match(`${environment.api}/propietario/gestor_cuenta/`).forEach(r => r.flush(mockPropietarioList));
    httpController.match(`${environment.api}/chofer/gestor_cuenta/`).forEach(r => r.flush(mockChoferList));
    httpController.match(`${environment.api}/ente_emisor_automotor/`).forEach(r => r.flush(mockEnteEmisorAutomotorList));
    httpController.match(`${environment.api}/ente_emisor_transporte/`).forEach(r => r.flush(mockEnteEmisorTransporteList));
    httpController.match(`${environment.api}/tipo_semi/`).forEach(r => r.flush(mockTipoSemiList));
    httpController.match(`${environment.api}/tipo_carga/`).forEach(r => r.flush(mockTipoCargaList));
    httpController.match(`${environment.api}/pais/`).forEach(r => r.flush(mockPaisList));
    httpController.match(`${environment.api}/localidad/${mockSemi.ciudad_habilitacion_municipal.localidad.pais_id}/`).forEach(r => r.flush(mockLocalidadList));
    httpController.match(`${environment.api}/ciudad/${mockSemi.ciudad_habilitacion_municipal.localidad_id}/`).forEach(r => r.flush(mockCiudadList));
    tick(500);
    const backSpy = spyOn(component, 'back').and.callThrough();
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    pageFormComponent.triggerEventHandler('editClick', null);
    tick(1);
    expect(backSpy).toHaveBeenCalled();
    expect(redirectToEditSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
