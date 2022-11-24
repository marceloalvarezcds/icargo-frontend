import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogService } from 'src/app/services/dialog.service';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { SeleccionableListComponent } from './seleccionable-list.component';

import { SeleccionableListService } from './seleccionable-list.service';

describe('SeleccionableListService', () => {
  @Component({ template: '' })
  class TestComponent {}

  let component: SeleccionableListComponent<
    TestComponent,
    SeleccionableFormDialogData
  >;
  let fixture: ComponentFixture<
    SeleccionableListComponent<TestComponent, SeleccionableFormDialogData>
  >;
  let service: SeleccionableListService<
    TestComponent,
    SeleccionableFormDialogData
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule,
      ],
      providers: [
        DialogService,
        SeleccionableService,
        SeleccionableListService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SeleccionableListComponent, TestComponent],
    });
    service = TestBed.inject(SeleccionableListService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<
      SeleccionableListComponent<TestComponent, SeleccionableFormDialogData>
    >(SeleccionableListComponent);
    service = TestBed.inject(SeleccionableListService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
