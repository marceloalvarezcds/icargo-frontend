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
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Cargo, mockCargoList } from 'src/app/interfaces/cargo';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';
import { UserListComponent } from './user-list.component';
import { UserListService } from './user-list.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpController: HttpTestingController;
  let pageComponent: DebugElement;
  let tableComponent: DebugElement;
  const modelo = m.CARGO;
  const submodule = 'Cargo';
  const row = mockCargoList[0];
  const tableEvent: TableEvent<Cargo> = {
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
        RouterTestingModule,
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
    component = fixture.componentInstance;
    pageComponent = findElement(fixture, 'app-page');
    tableComponent = findElement(fixture, 'app-table-paginator');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listens for app-page changes', () => {
    const createSpy = spyOn(component, 'create').and.callThrough();
    pageComponent.triggerEventHandler('createClick', new MouseEvent('click'));
    pageComponent.triggerEventHandler('applyClick', new MouseEvent('click'));
    expect(createSpy).toHaveBeenCalled();
  });

  it('listens for app-table changes', fakeAsync(() => {
    const editSpy = spyOn(component, 'edit').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);

    tick();

    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id/`)
      .flush(mockCargoList);
    flush();

    mockCargoList.forEach((x) =>
      component.columns.forEach((c) => c.value && c.value(x))
    );

    expect(editSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
