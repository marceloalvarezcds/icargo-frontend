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
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';
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
import { LiquidacionFormComponent } from '../liquidacion-form/liquidacion-form.component';
import { LiquidacionListComponent } from './liquidacion-list.component';

describe('LiquidacionListComponent', () => {
  let component: LiquidacionListComponent;
  let fixture: ComponentFixture<LiquidacionListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let reportsService: ReportsService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockLiquidacionList[0];
  const tableEvent: TableEvent<Liquidacion> = {
    row,
    index: 0,
  };
  const estado = EstadoEnum.EN_PROCESO;
  const estadoCuenta = mockEstadoCuentaList[0];
  const route = {
    snapshot: {
      queryParams: {
        tipo_contraparte_id: estadoCuenta.tipo_contraparte_id,
        contraparte: estadoCuenta.contraparte,
        contraparte_numero_documento: estadoCuenta.contraparte_numero_documento,
        estado,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: `estado-cuenta/${m.LIQUIDACION}/${a.CREAR}`,
            component: LiquidacionFormComponent,
          },
          {
            path: `estado-cuenta/${m.LIQUIDACION}/${a.EDITAR}/:id`,
            component: LiquidacionFormComponent,
          },
          {
            path: `estado-cuenta/${m.LIQUIDACION}/${a.VER}/:id`,
            component: LiquidacionFormComponent,
          },
        ]),
        EstadoCuentaModule,
      ],
      providers: [
        EstadoCuentaService,
        LiquidacionService,
        { provide: ActivatedRoute, useValue: route },
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionListComponent, LiquidacionFormComponent],
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
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(
      dialogRefSpyObj
    );
    const redirectToEditSpy = spyOn(
      component,
      'redirectToEdit'
    ).and.callThrough();
    const redirectToShowSpy = spyOn(
      component,
      'redirectToShow'
    ).and.callThrough();
    const deleteRowSpy = spyOn(component, 'deleteRow').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    tableComponent.triggerEventHandler('deleteClick', tableEvent);
    httpController
      .expectOne(
        `${environment.api}/${m.ESTADO_CUENTA}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}`
      )
      .flush(estadoCuenta);
    flush();
    httpController
      .expectOne(
        `${environment.api}/${m.LIQUIDACION}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
      )
      .flush(mockLiquidacionList);
    const req = httpController.expectOne(
      `${environment.api}/${m.LIQUIDACION}/${row.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();
    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    expect(deleteRowSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {
    component.estado = estado;
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
    pageComponent.triggerEventHandler('downloadClick', new MouseEvent('click'));

    expect(componentDownloadFileSpy).toHaveBeenCalled();

    httpController
      .expectOne(
        `${environment.api}/${m.ESTADO_CUENTA}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}`
      )
      .flush(estadoCuenta);
    flush();
    httpController
      .expectOne(
        `${environment.api}/${m.LIQUIDACION}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
      )
      .flush([]);
    httpController
      .expectOne(
        `${environment.api}/${m.LIQUIDACION}/reports/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
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
