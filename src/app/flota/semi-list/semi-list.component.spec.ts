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
import { SemiList, mockSemiList } from 'src/app/interfaces/semi';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { SemiService } from 'src/app/services/semi.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { SemiFormComponent } from 'src/app/flota/semi-form/semi-form.component';

import { SemiListComponent } from './semi-list.component';
import { DialogService } from 'src/app/services/dialog.service';

describe('SemiListComponent', () => {
  let component: SemiListComponent;
  let fixture: ComponentFixture<SemiListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  let reportsService: ReportsService;
  let searchService: SearchService;
  let dialogService: DialogService;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const row = mockSemiList[0];
  const tableEvent: TableEvent<SemiList> = {
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
            path: `flota/${m.SEMIRREMOLQUE}/${a.CREAR}`,
            component: SemiFormComponent,
          },
          {
            path: `flota/${m.SEMIRREMOLQUE}/${a.EDITAR}/:id`,
            component: SemiFormComponent,
          },
          {
            path: `flota/${m.SEMIRREMOLQUE}/${a.VER}/:id`,
            component: SemiFormComponent,
          },
        ]),
        SharedModule,
      ],
      providers: [
        SemiService,
        ReportsService,
        SearchService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SemiListComponent, SemiFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiListComponent);
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

    httpController.expectOne(`${environment.api}/semi/`).flush(mockSemiList);
    const req = httpController.expectOne(`${environment.api}/semi/${row.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();
    httpController.expectOne(`${environment.api}/semi/`).flush(mockSemiList);
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

    httpController.expectOne(`${environment.api}/semi/`).flush(mockSemiList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {
    const filename = 'semi_reports.xls';
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

    httpController.expectOne(`${environment.api}/semi/`).flush([]);
    httpController
      .expectOne(`${environment.api}/semi/reports/`)
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
    httpController.expectOne(`${environment.api}/semi/`).flush(mockSemiList);
    flush();

    const clasificacionFiltered = component.clasificacionFilterList.filter(
      (_, i) => i === 0
    );
    const marcaFiltered = component.marcaFilterList.filter((_, i) => i === 0);
    const paisFiltered = component.paisFilterList.filter((_, i) => i === 0);
    const propietarioFiltered = component.propietarioFilterList.filter(
      (_, i) => i === 0
    );
    const tipoFiltered = component.tipoFilterList.filter((_, i) => i === 0);
    const tipoCargaFiltered = component.tipoCargaFilterList.filter(
      (_, i) => i === 0
    );
    spyOn(
      component.clasificacionCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(clasificacionFiltered);
    spyOn(component.marcaCheckboxFilter, 'getFilteredList').and.returnValue(
      marcaFiltered
    );
    spyOn(component.paisCheckboxFilter, 'getFilteredList').and.returnValue(
      paisFiltered
    );
    spyOn(
      component.propietarioCheckboxFilter,
      'getFilteredList'
    ).and.returnValue(propietarioFiltered);
    spyOn(component.tipoCheckboxFilter, 'getFilteredList').and.returnValue(
      tipoFiltered
    );
    spyOn(component.tipoCargaCheckboxFilter, 'getFilteredList').and.returnValue(
      tipoCargaFiltered
    );

    const filter = {
      clasificacion: clasificacionFiltered.join('|'),
      marca: marcaFiltered.join('|'),
      pais: paisFiltered.join('|'),
      propietario: propietarioFiltered.join('|'),
      tipo: tipoFiltered.join('|'),
      tipo_carga: tipoCargaFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    tick(500);
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const semi = mockSemiList.find((_, i) => i === 0)!;
    component.filterPredicate(semi, filterStr);
    component.filterPredicate(semi, '{}');
    component.columns.forEach((c) => c.value && c.value(semi));
    httpController.verify();
  }));
});
