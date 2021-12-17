import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { FleteList, mockFleteList } from 'src/app/interfaces/flete';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { FleteService } from 'src/app/services/flete.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { FleteFormComponent } from 'src/app/flete/flete-form/flete-form.component';

import { FleteListComponent } from './flete-list.component';

describe('FleteListComponent', () => {
  let component: FleteListComponent;
  let fixture: ComponentFixture<FleteListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  let reportsService: ReportsService;
  let searchService: SearchService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockFleteList[0];
  const tableEvent: TableEvent<FleteList> = {
    row, index: 0,
  }

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
            path: `flete/${m.FLETE}/${a.CREAR}`,
            component: FleteFormComponent,
          },
          {
            path: `flete/${m.FLETE}/${a.EDITAR}/:id`,
            component: FleteFormComponent,
          },
          {
            path: `flete/${m.FLETE}/${a.VER}/:id`,
            component: FleteFormComponent,
          },
        ]),
        SharedModule,
      ],
      providers: [
        FleteService,
        ReportsService,
        SearchService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FleteListComponent, FleteFormComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteListComponent);
    httpController = TestBed.inject(HttpTestingController);
    reportsService = TestBed.inject(ReportsService);
    searchService = TestBed.inject(SearchService);
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    tableComponent = findElement(fixture, 'app-table-paginator');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listens for app-page changes', () => {
    const redirectToCreateSpy = spyOn(component, 'redirectToCreate').and.callThrough();
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
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(dialogRefSpyObj);
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    const redirectToShowSpy = spyOn(component, 'redirectToShow').and.callThrough();
    const deleteRowSpy = spyOn(component, 'deleteRow').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    tableComponent.triggerEventHandler('deleteClick', tableEvent);

    tick();

    httpController.expectOne(`${environment.api}/flete/`).flush(mockFleteList);
    const req = httpController.expectOne(`${environment.api}/flete/${row.id}`)
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();

    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    expect(deleteRowSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should make an http call to get the list', fakeAsync(() => {
    const spy = spyOn((component as any), 'resetFilterList').and.callThrough();

    httpController.expectOne(`${environment.api}/flete/`).flush(mockFleteList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {

    const filename = 'flete_reports.xls';
    const componentDownloadFileSpy = spyOn(component, 'downloadFile').and.callThrough();
    const serviceDownloadFileSpy = spyOn(reportsService, 'downloadFile').and.callThrough();
    pageComponent.triggerEventHandler('downloadClick', new MouseEvent('click'));

    expect(componentDownloadFileSpy).toHaveBeenCalled();

    httpController.expectOne(`${environment.api}/flete/`).flush([]);
    httpController.expectOne(`${environment.api}/flete/reports/`).flush(filename);
    httpController.expectOne(`${environment.api}/reports/${filename}`).flush(fakeFile());

    flush();

    expect(serviceDownloadFileSpy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should apply filter', fakeAsync(() => {
    const searchSpy = spyOn(searchService, 'search').and.callThrough();
    httpController.expectOne(`${environment.api}/flete/`).flush(mockFleteList);
    flush();

    const estadoFiltered = component.estadoFilterList.filter((_, i) => i === 0);
    const productoFiltered = component.productoFilterList.filter((_, i) => i === 0);
    const publicadoFiltered = component.publicadoFilterList.filter((_, i) => i === 0);
    spyOn(component.estadoCheckboxFilter, 'getFilteredList').and.returnValue(estadoFiltered);
    spyOn(component.productoCheckboxFilter, 'getFilteredList').and.returnValue(productoFiltered);
    spyOn(component.publicadoCheckboxFilter, 'getFilteredList').and.returnValue(publicadoFiltered);

    const filter = {
      estado: estadoFiltered.join('|'),
      producto: productoFiltered.join('|'),
      publicado: publicadoFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const flete = mockFleteList.find((_, i) => i === 0)!;
    component.filterPredicate(flete, filterStr);
    component.filterPredicate(flete, '{}');
    component.columns.forEach(c => c.value && c.value(flete));
    httpController.verify();
  }));
});
