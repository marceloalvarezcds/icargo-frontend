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
import { of } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Banco, mockBancoList } from 'src/app/interfaces/banco';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { BancoService } from 'src/app/services/banco.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { BancoFormComponent } from '../banco-form/banco-form.component';
import { BancoListComponent } from './banco-list.component';

describe('BancoListComponent', () => {
  let component: BancoListComponent;
  let fixture: ComponentFixture<BancoListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let reportsService: ReportsService;
  let searchService: SearchService;
  let dialogService: DialogService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockBancoList[0];
  const tableEvent: TableEvent<Banco> = {
    row,
    index: 0,
  };

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
          {
            path: `banco/${m.BANCO}/${a.CREAR}`,
            component: BancoFormComponent,
          },
          {
            path: `banco/${m.BANCO}/${a.EDITAR}/:id`,
            component: BancoFormComponent,
          },
          {
            path: `banco/${m.BANCO}/${a.VER}/:id`,
            component: BancoFormComponent,
          },
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
      declarations: [BancoListComponent, BancoFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoListComponent);
    httpController = TestBed.inject(HttpTestingController);
    reportsService = TestBed.inject(ReportsService);
    searchService = TestBed.inject(SearchService);
    dialogService = TestBed.inject(DialogService);
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    tableComponent = findElement(fixture, 'app-table-paginator');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listens for app-page changes', () => {
    const redirectToCreateSpy = spyOn(
      component,
      'redirectToCreate'
    ).and.callThrough();
    const applyFilterSpy = spyOn(component, 'applyFilter').and.callThrough();
    const resetFilterSpy = spyOn(component, 'resetFilter').and.callThrough();
    const searchSpy = spyOn(searchService, 'search').and.callThrough();
    pageComponent.triggerEventHandler('createClick', new MouseEvent('click'));
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    pageComponent.triggerEventHandler('resetClick', new MouseEvent('click'));
    expect(redirectToCreateSpy).toHaveBeenCalled();
    expect(applyFilterSpy).toHaveBeenCalled();
    expect(resetFilterSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalled();
  });

  it('listens for app-table changes', fakeAsync(() => {
    const dialogServiceSpy = spyOn(
      (dialogService as any).dialog,
      'open'
    ).and.returnValue(dialogRefSpyObj);
    const dialogSpy = spyOn(
      (component as any).dialog,
      'confirmationToDelete'
    ).and.callThrough();
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

    tick();

    httpController
      .match(`${environment.api}/banco/gestor_carga_id`)
      .forEach((r) => r.flush(mockBancoList));
    const req = httpController.expectOne(`${environment.api}/banco/${row.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();
    httpController
      .match(`${environment.api}/banco/gestor_carga_id`)
      .forEach((r) => r.flush(mockBancoList));
    flush();

    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    expect(deleteRowSpy).toHaveBeenCalled();
    expect(dialogServiceSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should make an http call to get the list', fakeAsync(() => {
    const spy = spyOn(component as any, 'resetFilterList').and.callThrough();

    httpController
      .expectOne(`${environment.api}/banco/gestor_carga_id`)
      .flush(mockBancoList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {
    const filename = 'banco_reports.xls';
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
      .expectOne(`${environment.api}/banco/gestor_carga_id`)
      .flush([]);
    httpController
      .expectOne(`${environment.api}/banco/reports`)
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
      .expectOne(`${environment.api}/banco/gestor_carga_id`)
      .flush(mockBancoList);
    flush();

    const estadoFiltered = component.estadoFilterList.filter((_, i) => i === 0);
    const monedaFiltered = component.monedaFilterList.filter((_, i) => i === 0);
    spyOn(component.estadoCheckboxFilter, 'getFilteredList').and.returnValue(
      estadoFiltered
    );
    spyOn(component.monedaCheckboxFilter, 'getFilteredList').and.returnValue(
      monedaFiltered
    );

    const filter = {
      estado: estadoFiltered.join('|'),
      moneda: monedaFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const item = mockBancoList.find((_, i) => i === 0)!;
    component.filterPredicate(item, filterStr);
    component.filterPredicate(item, '{}');
    mockBancoList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );
    httpController.verify();
  }));
});
