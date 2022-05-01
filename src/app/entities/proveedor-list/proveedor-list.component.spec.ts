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
import { mockProveedorList, ProveedorList } from 'src/app/interfaces/proveedor';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogService } from 'src/app/services/dialog.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';
import { ProveedorListComponent } from './proveedor-list.component';

describe('ProveedorListComponent', () => {
  let component: ProveedorListComponent;
  let fixture: ComponentFixture<ProveedorListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let reportsService: ReportsService;
  let searchService: SearchService;
  let dialogService: DialogService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockProveedorList[0];
  const tableEvent: TableEvent<ProveedorList> = {
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
            path: `entities/${m.PROVEEDOR}/${a.CREAR}`,
            component: ProveedorFormComponent,
          },
          {
            path: `entities/${m.PROVEEDOR}/${a.EDITAR}/:id`,
            component: ProveedorFormComponent,
          },
          {
            path: `entities/${m.PROVEEDOR}/${a.VER}/:id`,
            component: ProveedorFormComponent,
          },
        ]),
        SharedModule,
      ],
      providers: [
        ProveedorService,
        ReportsService,
        SearchService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ProveedorListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorListComponent);
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
      .expectOne(`${environment.api}/proveedor/`)
      .flush(mockProveedorList);
    const req = httpController.expectOne(
      `${environment.api}/proveedor/${row.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();
    httpController
      .expectOne(`${environment.api}/proveedor/`)
      .flush(mockProveedorList);
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
      .expectOne(`${environment.api}/proveedor/`)
      .flush(mockProveedorList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {
    const filename = 'proveedor_reports.xls';
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

    httpController.expectOne(`${environment.api}/proveedor/`).flush([]);
    httpController
      .expectOne(`${environment.api}/proveedor/reports/`)
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
      .expectOne(`${environment.api}/proveedor/`)
      .flush(mockProveedorList);
    flush();

    const ciudadFiltered = component.ciudadFilterList.filter((_, i) => i === 0);
    const composicionJuridicaFiltered =
      component.composicionJuridicaFilterList.filter((_, i) => i === 0);
    const paisFiltered = component.paisFilterList.filter((_, i) => i === 0);
    const tipoDocumentoFiltered = component.tipoDocumentoFilterList.filter(
      (_, i) => i === 0
    );
    spyOn(
      component.composicionJuridicaCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(composicionJuridicaFiltered);
    spyOn(component.ciudadCheckboxFilter, 'getFilteredList').and.returnValue(
      ciudadFiltered
    );
    spyOn(component.paisCheckboxFilter, 'getFilteredList').and.returnValue(
      paisFiltered
    );
    spyOn(
      component.tipoDocumentoCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(tipoDocumentoFiltered);

    const filter = {
      ciudad: ciudadFiltered.join('|'),
      composicion_juridica: composicionJuridicaFiltered.join('|'),
      pais: paisFiltered.join('|'),
      tipo_documento: tipoDocumentoFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const proveedor = mockProveedorList.find((_, i) => i === 0)!;
    component.filterPredicate(proveedor, filterStr);
    component.filterPredicate(proveedor, '{}');
    component.columns.forEach((c) => c.value && c.value(proveedor));
    httpController.verify();
  }));
});
