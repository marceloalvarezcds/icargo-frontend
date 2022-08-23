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
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';
import { LiquidacionEditFormComponent } from 'src/app/estado-cuenta/liquidacion-edit-form/liquidacion-edit-form.component';
import { mockEstadoCuentaList } from 'src/app/interfaces/estado-cuenta';
import {
  Liquidacion,
  mockLiquidacionList,
} from 'src/app/interfaces/liquidacion';
import { TableEvent } from 'src/app/interfaces/table';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { LiquidacionListComponent } from './liquidacion-list.component';

describe('LiquidacionListComponent', () => {
  let component: LiquidacionListComponent;
  let fixture: ComponentFixture<LiquidacionListComponent>;
  let httpController: HttpTestingController;
  let reportsService: ReportsService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockLiquidacionList[0];
  const tableEvent: TableEvent<Liquidacion> = {
    row,
    index: 0,
  };
  const etapa = LiquidacionEtapaEnum.EN_PROCESO;
  const etapaURI = encodeURIComponent(etapa);
  const estadoCuenta = mockEstadoCuentaList[0];
  const contraparte = encodeURIComponent(estadoCuenta.contraparte);
  const route = {
    snapshot: {
      queryParams: {
        tipo_contraparte_id: estadoCuenta.tipo_contraparte_id,
        contraparte_id: estadoCuenta.contraparte_id,
        contraparte: estadoCuenta.contraparte,
        contraparte_numero_documento: estadoCuenta.contraparte_numero_documento,
        etapa,
      },
    },
  };
  const withBackUrlRoute = {
    snapshot: {
      queryParams: {
        ...route.snapshot.queryParams,
        backUrl: '/',
      },
    },
  };

  describe('without back', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: `estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`,
              component: LiquidacionEditFormComponent,
            },
            {
              path: `estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.EDITAR}/:id`,
              component: LiquidacionEditFormComponent,
            },
            {
              path: `estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.VER}/:id`,
              component: LiquidacionEditFormComponent,
            },
          ]),
          EstadoCuentaModule,
        ],
        providers: [
          EstadoCuentaService,
          LiquidacionService,
          { provide: ActivatedRoute, useValue: route },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [LiquidacionListComponent, LiquidacionEditFormComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(LiquidacionListComponent);
      httpController = TestBed.inject(HttpTestingController);
      reportsService = TestBed.inject(ReportsService);
      component = fixture.componentInstance;
      pageComponent = findElement(fixture, 'app-page');
      tableComponent = findElement(fixture, 'app-table-paginator');
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('listens for app-table changes', fakeAsync(() => {
      const redirectToEditSpy = spyOn(
        component,
        'redirectToEdit'
      ).and.callThrough();
      const redirectToShowSpy = spyOn(
        component,
        'redirectToShow'
      ).and.callThrough();
      pageComponent.triggerEventHandler('backClick', false);
      tableComponent.triggerEventHandler('editClick', tableEvent);
      tableComponent.triggerEventHandler('showClick', tableEvent);
      httpController
        .expectOne(
          `${environment.api}/${m.ESTADO_CUENTA}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/id/${estadoCuenta.contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}`
        )
        .flush(estadoCuenta);
      flush();
      httpController
        .expectOne(
          `${environment.api}/${m.LIQUIDACION}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/id/${estadoCuenta.contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/etapa/${etapaURI}`
        )
        .flush(mockLiquidacionList);
      flush();
      expect(redirectToEditSpy).toHaveBeenCalled();
      expect(redirectToShowSpy).toHaveBeenCalled();
      httpController.verify();
    }));

    it('should make an http call to download the list', fakeAsync(() => {
      component.etapa = LiquidacionEtapaEnum.EN_PROCESO;
      component.estadoCuenta = estadoCuenta;
      const filename = `${m.LIQUIDACION}_reports.xls`;
      const componentDownloadFileSpy = spyOn(
        component,
        'downloadFile'
      ).and.callThrough();
      const serviceDownloadFileSpy = spyOn(
        reportsService,
        'downloadFile'
      ).and.callThrough();
      pageComponent.triggerEventHandler(
        'downloadClick',
        new MouseEvent('click')
      );

      expect(componentDownloadFileSpy).toHaveBeenCalled();

      httpController
        .expectOne(
          `${environment.api}/${m.ESTADO_CUENTA}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/id/${estadoCuenta.contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}`
        )
        .flush(estadoCuenta);
      flush();
      httpController
        .expectOne(
          `${environment.api}/${m.LIQUIDACION}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/id/${estadoCuenta.contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/etapa/${etapaURI}`
        )
        .flush([]);
      httpController
        .expectOne(
          `${environment.api}/${m.LIQUIDACION}/reports/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/id/${estadoCuenta.contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/etapa/${etapaURI}`
        )
        .flush(filename);
      httpController
        .expectOne(`${environment.api}/reports/${filename}`)
        .flush(fakeFile());

      flush();

      expect(serviceDownloadFileSpy).toHaveBeenCalled();

      httpController.verify();
    }));
  });

  describe('with back', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: `estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.EDITAR}/:id`,
              component: LiquidacionEditFormComponent,
            },
            {
              path: `estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.VER}/:id`,
              component: LiquidacionEditFormComponent,
            },
          ]),
          EstadoCuentaModule,
        ],
        providers: [
          EstadoCuentaService,
          LiquidacionService,
          { provide: ActivatedRoute, useValue: withBackUrlRoute },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [LiquidacionListComponent, LiquidacionEditFormComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(LiquidacionListComponent);
      httpController = TestBed.inject(HttpTestingController);
      reportsService = TestBed.inject(ReportsService);
      component = fixture.componentInstance;
      pageComponent = findElement(fixture, 'app-page');
      tableComponent = findElement(fixture, 'app-table-paginator');
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      mockLiquidacionList.forEach((liq) =>
        component.columns.forEach((c) => c.value && c.value(liq))
      );
    });
  });
});
