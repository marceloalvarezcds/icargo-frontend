import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { mockInstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { InstrumentoFormDialogComponent } from './instrumento-form-dialog.component';

describe('InstrumentoFormDialogComponent', () => {
  let component: InstrumentoFormDialogComponent;
  let fixture: ComponentFixture<InstrumentoFormDialogComponent>;
  const dialogData = mockInstrumentoFormDialogData;
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
      declarations: [InstrumentoFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
