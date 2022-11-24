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
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { mockRolList, Rol } from 'src/app/interfaces/rol';
import { TableEvent } from 'src/app/interfaces/table';
import { ReportsService } from 'src/app/services/reports.service';
import { RolService } from 'src/app/services/rol.service';
import { SearchService } from 'src/app/services/search.service';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { RolFormComponent } from '../rol-form/rol-form.component';
import { UsersModule } from '../users.module';
import { RolListComponent } from './rol-list.component';
import { RolListService } from './rol-list.service';

describe('RolListComponent', () => {
  let component: RolListComponent;
  let fixture: ComponentFixture<RolListComponent>;
  let httpController: HttpTestingController;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const modelo = m.ROL;
  const submodule = 'Rol';
  const row = mockRolList[0];
  const tableEvent: TableEvent<Rol> = {
    row,
    index: 0,
  };
  const route = {
    snapshot: {
      data: {
        modelo,
        submodule,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        UsersModule,
        RouterTestingModule.withRoutes([
          {
            path: `users/${modelo}/${a.CREAR}`,
            component: RolFormComponent,
          },
          {
            path: `users/${modelo}/${a.EDITAR}/:id`,
            component: RolFormComponent,
          },
          {
            path: `users/${modelo}/${a.VER}/:id`,
            component: RolFormComponent,
          },
        ]),
      ],
      providers: [
        ReportsService,
        RolService,
        RolListService,
        SearchService,
        { provide: ActivatedRoute, useValue: route },
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [RolListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolListComponent);
    httpController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    tableComponent = findElement(fixture, 'app-table-paginator');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listens for app-page changes', () => {
    const createSpy = spyOn(component, 'redirectToCreate').and.callThrough();
    pageComponent.triggerEventHandler('createClick', new MouseEvent('click'));
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    expect(createSpy).toHaveBeenCalled();
  });

  it('listens for app-table changes', fakeAsync(() => {
    const redirectToEditSpy = spyOn(
      component,
      'redirectToEdit'
    ).and.callThrough();
    const redirectToShowSpy = spyOn(
      component,
      'redirectToShow'
    ).and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);

    tick();

    httpController.expectOne(`${environment.api}/rol/`).flush(mockRolList);
    flush();

    mockRolList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );

    expect(redirectToEditSpy).toHaveBeenCalled();
    expect(redirectToShowSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
