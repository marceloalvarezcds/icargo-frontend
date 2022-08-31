import { CommonModule } from '@angular/common';
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
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockEstadoCuentaList } from 'src/app/interfaces/estado-cuenta';
import { MaterialModule } from 'src/app/material/material.module';
import { BancoService } from 'src/app/services/banco.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { EstadoCuentaListComponent } from './estado-cuenta-list.component';

describe('EstadoCuentaListComponent', () => {
  let component: EstadoCuentaListComponent;
  let fixture: ComponentFixture<EstadoCuentaListComponent>;
  let httpController: HttpTestingController;
  let reportsService: ReportsService;
  let searchService: SearchService;
  let pageComponent: DebugElement;
  const row = mockEstadoCuentaList[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          // {
          //   path: `banco/${m.BANCO}/${a.CREAR}`,
          //   component: BancoFormComponent,
          // },
        ]),
        SharedModule,
      ],
      providers: [
        BancoService,
        ReportsService,
        SearchService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [EstadoCuentaListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaListComponent);
    httpController = TestBed.inject(HttpTestingController);
    reportsService = TestBed.inject(ReportsService);
    searchService = TestBed.inject(SearchService);
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make an http call to get the list', fakeAsync(() => {
    const spy = spyOn(component as any, 'resetFilterList').and.callThrough();

    httpController
      .expectOne(`${environment.api}/estado_cuenta/gestor_carga_id`)
      .flush(mockEstadoCuentaList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {
    const filename = 'estado_cuenta_reports.xls';
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
      .expectOne(`${environment.api}/estado_cuenta/gestor_carga_id`)
      .flush([]);
    httpController
      .expectOne(`${environment.api}/estado_cuenta/reports`)
      .flush(filename);
    httpController
      .expectOne(`${environment.api}/reports/${filename}`)
      .flush(fakeFile());

    flush();

    expect(serviceDownloadFileSpy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should apply filter', fakeAsync(() => {
    const searchSpy = spyOn(searchService, 'search').and.callThrough();
    httpController
      .expectOne(`${environment.api}/estado_cuenta/gestor_carga_id`)
      .flush(mockEstadoCuentaList);
    flush();

    const tipoContraparteFiltered = component.tipoContraparteFilterList.filter(
      (_, i) => i === 0
    );
    const contraparteFiltered = component.contraparteFilterList.filter(
      (_, i) => i === 0
    );
    spyOn(
      component.tipoContraparteCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(tipoContraparteFiltered);
    spyOn(
      component.contraparteCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(contraparteFiltered);

    const filter = {
      tipo_contraparte_descripcion: tipoContraparteFiltered.join('|'),
      contraparte: contraparteFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const item = mockEstadoCuentaList.find((_, i) => i === 0)!;
    component.filterPredicate(item, filterStr);
    component.filterPredicate(item, '{}');
    mockEstadoCuentaList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );
    httpController.verify();
  }));
});
