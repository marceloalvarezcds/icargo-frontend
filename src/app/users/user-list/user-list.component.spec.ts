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
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { TableEvent } from 'src/app/interfaces/table';
import { mockUserList, User } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserListComponent } from './user-list.component';
import { UserListService } from './user-list.service';

describe('UserListComponent', () => {
  let service: UserListService;
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpController: HttpTestingController;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const modelo = m.USER;
  const submodule = 'User';
  const row = mockUserList[0];
  const tableEvent: TableEvent<User> = {
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
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: `users/${modelo}/${a.CREAR}`,
            component: UserFormComponent,
          },
          {
            path: `users/${modelo}/${a.EDITAR}/:id`,
            component: UserFormComponent,
          },
          {
            path: `users/${modelo}/${a.VER}/:id`,
            component: UserFormComponent,
          },
        ]),
        SharedModule,
      ],
      providers: [
        UserService,
        UserListService,
        ReportsService,
        SearchService,
        { provide: ActivatedRoute, useValue: route },
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UserListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserListService);
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
    const editSpy = spyOn(component, 'redirectToEdit').and.callThrough();
    const showSpy = spyOn(component, 'redirectToShow').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);

    tick();

    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush(mockUserList);
    flush();

    mockUserList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );

    expect(editSpy).toHaveBeenCalled();
    expect(showSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
