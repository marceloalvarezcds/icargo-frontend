import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { CamionFormComponent } from 'src/app/flota/camion-form/camion-form.component';
import { CamionList, mockCamionList } from 'src/app/interfaces/camion';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CamionService } from 'src/app/services/camion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { PropietarioCamionListComponent } from './propietario-camion-list.component';

describe('PropietarioCamionListComponent', () => {
  let component: PropietarioCamionListComponent;
  let fixture: ComponentFixture<PropietarioCamionListComponent>;
  let httpController: HttpTestingController;
  let dialogService: DialogService;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  const row = mockCamionList[0];
  const tableEvent: TableEvent<CamionList> = {
    row,
    index: 0,
  };
  const propietarioId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        PipesModule,
        SharedModule,
        RouterTestingModule.withRoutes([
          {
            path: `flota/${m.CAMION}/${a.CREAR}`,
            component: CamionFormComponent,
          },
          {
            path: `flota/${m.CAMION}/${a.EDITAR}/:id`,
            component: CamionFormComponent,
          },
          {
            path: `flota/${m.CAMION}/${a.VER}/:id`,
            component: CamionFormComponent,
          },
        ]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        CamionService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      declarations: [PropietarioCamionListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioCamionListComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(DialogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.columns.forEach((c) => c.value && c.value(mockCamionList[0]));
    component.propietarioId = undefined;
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId', fakeAsync(() => {
    component.propietarioId = 1;
    httpController
      .expectOne(`${environment.api}/camion/propietario/${propietarioId}/`)
      .flush(mockCamionList);
    flush();
    expect(component.list).toBe(mockCamionList);
  }));

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
    const tableComponent = findElement(fixture, 'app-table');
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    tableComponent.triggerEventHandler('deleteClick', tableEvent);
    component.redirectToCreate();
    tick();
    const req = httpController.expectOne(`${environment.api}/camion/${row.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    flush();
    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    expect(deleteRowSpy).toHaveBeenCalled();
    expect(dialogServiceSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
