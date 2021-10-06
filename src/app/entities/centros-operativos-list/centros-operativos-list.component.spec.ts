import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { MaterialModule } from 'src/app/material/material.module';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableComponent } from 'src/app/shared/table/table.component';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { CentrosOperativosListComponent } from './centros-operativos-list.component';

describe('CentrosOperativosListComponent', () => {
  let component: CentrosOperativosListComponent;
  let fixture: ComponentFixture<CentrosOperativosListComponent>;
  let httpController: HttpTestingController;
  let reportsService: ReportsService;
  let searchService: SearchService;
  let pageComponent: DebugElement;

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
        SharedModule,
      ],
      providers: [ CentroOperativoService, ReportsService, SearchService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CentrosOperativosListComponent, TableComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrosOperativosListComponent);
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

  it('listens for app-page changes', () => {
    const applyFilterSpy = spyOn(component, 'applyFilter').and.callThrough();
    const resetFilterSpy = spyOn(component, 'resetFilter').and.callThrough();
    const searchSpy = spyOn(searchService, 'search').and.callThrough();
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    pageComponent.triggerEventHandler('resetClick', new MouseEvent('click'));
    expect(applyFilterSpy).toHaveBeenCalled();
    expect(resetFilterSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalled();
  });

  it('should make an http call to get the list', fakeAsync(() => {
    const spy = spyOn((component as any), 'resetFilterList').and.callThrough();

    httpController.expectOne(`${environment.api}/centro_operativo/`).flush(mockCentroOperativoList);

    flush();

    expect(spy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should make an http call to download the list', fakeAsync(() => {

    const filename = 'centro_operativo_reports.xls';
    const componentDownloadFileSpy = spyOn(component, 'downloadFile').and.callThrough();
    const serviceDownloadFileSpy = spyOn(reportsService, 'downloadFile').and.callThrough();
    pageComponent.triggerEventHandler('downloadClick', new MouseEvent('click'));

    expect(componentDownloadFileSpy).toHaveBeenCalled();

    httpController.expectOne(`${environment.api}/centro_operativo/`).flush([]);
    httpController.expectOne(`${environment.api}/centro_operativo/reports/`).flush(filename);
    httpController.expectOne(`${environment.api}/reports/${filename}`).flush(fakeFile());

    flush();

    expect(serviceDownloadFileSpy).toHaveBeenCalled();

    httpController.verify();
  }));

  it('should apply filter', fakeAsync(() => {
    const searchSpy = spyOn(searchService, 'search').and.callThrough();
    httpController.expectOne(`${environment.api}/centro_operativo/`).flush(mockCentroOperativoList);
    flush();

    const clasificacionFiltered = component.clasificacionFilterList.filter((_, i) => i === 0);
    const ciudadFiltered = component.ciudadFilterList.filter((_, i) => i === 0);
    const paisFiltered = component.paisFilterList.filter((_, i) => i === 0);
    spyOn(component.clasificacionCheckboxFilter, 'getFilteredList').and.returnValue(clasificacionFiltered);
    spyOn(component.ciudadCheckboxFilter, 'getFilteredList').and.returnValue(ciudadFiltered);
    spyOn(component.paisCheckboxFilter, 'getFilteredList').and.returnValue(paisFiltered);

    const filter = {
      clasificacion: clasificacionFiltered.join('|'),
      ciudad: ciudadFiltered.join('|'),
      pais: paisFiltered.join('|'),
    };
    const filterStr = JSON.stringify(filter);
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    expect(searchSpy).toHaveBeenCalledWith(filterStr, false);

    const centroOperativo = mockCentroOperativoList.find((_, i) => i === 0)!;
    component.filterPredicate(centroOperativo, filterStr);
    component.filterPredicate(centroOperativo, '{}');
    component.columns.forEach(c => c.value && c.value(centroOperativo));
    searchService.search(''); // Ignorar en las otras pruebas de componentes de listas
    httpController.verify();
  }));
});
