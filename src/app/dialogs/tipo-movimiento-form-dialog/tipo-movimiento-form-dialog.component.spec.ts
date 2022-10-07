import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockSeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogsModule } from '../dialogs.module';

import { TipoMovimientoFormDialogComponent } from './tipo-movimiento-form-dialog.component';

describe('TipoMovimientoFormDialogComponent', () => {
  let component: TipoMovimientoFormDialogComponent;
  let fixture: ComponentFixture<TipoMovimientoFormDialogComponent>;
  const dialogData = mockSeleccionableFormDialogData;
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close: () => {} });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        DialogsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TipoMovimientoFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMovimientoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
