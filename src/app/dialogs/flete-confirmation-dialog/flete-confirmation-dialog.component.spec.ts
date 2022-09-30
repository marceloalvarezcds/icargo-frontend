import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockFleteConfirmationDialogData } from 'src/app/interfaces/flete-confirmation-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogsModule } from '../dialogs.module';

import { FleteConfirmationDialogComponent } from './flete-confirmation-dialog.component';

describe('FleteConfirmationDialogComponent', () => {
  let component: FleteConfirmationDialogComponent;
  let fixture: ComponentFixture<FleteConfirmationDialogComponent>;
  const dialogData = mockFleteConfirmationDialogData;
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
        SharedModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [FleteConfirmationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
