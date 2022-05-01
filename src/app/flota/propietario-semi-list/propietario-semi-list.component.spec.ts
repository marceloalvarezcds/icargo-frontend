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
import { SemiFormComponent } from 'src/app/flota/semi-form/semi-form.component';
import { mockSemiList, SemiList } from 'src/app/interfaces/semi';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SemiService } from 'src/app/services/semi.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { PropietarioSemiListComponent } from './propietario-semi-list.component';

describe('PropietarioSemiListComponent', () => {
  let component: PropietarioSemiListComponent;
  let fixture: ComponentFixture<PropietarioSemiListComponent>;
  let httpController: HttpTestingController;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
  const row = mockSemiList[0];
  const tableEvent: TableEvent<SemiList> = {
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        SemiService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      declarations: [PropietarioSemiListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioSemiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.columns.forEach((c) => c.value && c.value(mockSemiList[0]));
    component.propietarioId = undefined;
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId', fakeAsync(() => {
    component.propietarioId = 1;
    httpController
      .expectOne(`${environment.api}/semi/propietario/${propietarioId}/`)
      .flush(mockSemiList);
    flush();
    expect(component.list).toBe(mockSemiList);
  }));

  it('listens for app-table changes', fakeAsync(() => {
    const dialogSpy = spyOn(
      (component as any).dialog,
      'confirmationToDelete'
    ).and.returnValue(dialogRefSpyObj);
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
    httpController.match(`${environment.api}/semi/${row.id}`).forEach((req) => {
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
    flush();
    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    expect(deleteRowSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
