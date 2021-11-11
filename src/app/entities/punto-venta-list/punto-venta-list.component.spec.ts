import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { mockPuntoVentaList, PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { PuntoVentaFormComponent } from '../punto-venta-form/punto-venta-form.component';

import { PuntoVentaListComponent } from './punto-venta-list.component';

describe('PuntoVentaListComponent', () => {
  let component: PuntoVentaListComponent;
  let fixture: ComponentFixture<PuntoVentaListComponent>;
  let httpController: HttpTestingController;
  let reportsService: ReportsService;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  let tableComponent: DebugElement;
  const proveedorId = 1;
  const row = mockPuntoVentaList[0];
  const tableEvent: TableEvent<PuntoVentaList> = {
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
            path: 'entities/punto-venta/create/:proveedorId',
            component: PuntoVentaFormComponent,
          },
          {
            path: 'entities/punto-venta/edit/:proveedorId/:id',
            component: PuntoVentaFormComponent,
          },
          {
            path: 'entities/punto-venta/show/:proveedorId/:id',
            component: PuntoVentaFormComponent,
          },
        ]),
        SharedModule,
      ],
      providers: [
        PuntoVentaService,
        ReportsService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PuntoVentaListComponent, PuntoVentaFormComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaListComponent);
    httpController = TestBed.inject(HttpTestingController);
    reportsService = TestBed.inject(ReportsService);
    component = fixture.componentInstance;
    tableComponent = findElement(fixture, 'app-table-paginator');
  });

  it('should create', () => {
    component.proveedorId = undefined;
    fixture.detectChanges();
    component.columns.forEach(c => c.value && c.value(row));
    expect(component).toBeTruthy();
  });

  it('listens for app-table changes', fakeAsync(() => {
    component.proveedorId = proveedorId;
    fixture.detectChanges();
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(dialogRefSpyObj);
    const redirectToEditSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    const redirectToShowSpy = spyOn(component, 'redirectToShow').and.callThrough();
    const deleteRowSpy = spyOn(component, 'deleteRow').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    tableComponent.triggerEventHandler('deleteClick', tableEvent);

    tick();

    httpController.expectOne(`${environment.api}/punto_venta/${proveedorId}/`).flush(mockPuntoVentaList);
    const req = httpController.expectOne(`${environment.api}/punto_venta/${row.id}`)
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
    component.proveedorId = proveedorId;
    fixture.detectChanges();
    const filename = 'punto_venta_reports.xls';
    const componentDownloadFileSpy = spyOn(component, 'downloadFile').and.callThrough();
    const serviceDownloadFileSpy = spyOn(reportsService, 'downloadFile').and.callThrough();
    const downloadButton = fixture.debugElement.query(By.css('.download-button'));
    downloadButton.triggerEventHandler('click', new MouseEvent('click'));
    expect(componentDownloadFileSpy).toHaveBeenCalled();
    httpController.expectOne(`${environment.api}/punto_venta/${proveedorId}/`).flush([]);
    httpController.expectOne(`${environment.api}/punto_venta/reports/${proveedorId}/`).flush(filename);
    httpController.expectOne(`${environment.api}/reports/${filename}`).flush(fakeFile());
    flush();
    expect(serviceDownloadFileSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
