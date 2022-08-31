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
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockRentabilidadList } from 'src/app/interfaces/rentabilidad';
import { MaterialModule } from 'src/app/material/material.module';
import { BancoService } from 'src/app/services/banco.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { fakeFile, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { RentabilidadListComponent } from './rentabilidad-list.component';

describe('RentabilidadListComponent', () => {
  let component: RentabilidadListComponent;
  let fixture: ComponentFixture<RentabilidadListComponent>;
  let httpController: HttpTestingController;
  let reportsService: ReportsService;
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
        RouterTestingModule,
        SharedModule,
      ],
      providers: [BancoService, ReportsService, SearchService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [RentabilidadListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentabilidadListComponent);
    httpController = TestBed.inject(HttpTestingController);
    reportsService = TestBed.inject(ReportsService);
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make an http call to download the list', fakeAsync(() => {
    const filename = 'rentabilidad_reports.xls';
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

    httpController.expectOne(`${environment.api}/rentabilidad/`).flush([]);
    httpController
      .expectOne(`${environment.api}/rentabilidad/reports`)
      .flush(filename);
    httpController
      .expectOne(`${environment.api}/reports/${filename}`)
      .flush(fakeFile());

    flush();

    expect(serviceDownloadFileSpy).toHaveBeenCalled();

    mockRentabilidadList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );
    httpController.verify();
  }));
});
