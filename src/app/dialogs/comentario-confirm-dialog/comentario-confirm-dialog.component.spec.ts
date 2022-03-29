import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockRequiredComentarioConfirmDialogData } from 'src/app/interfaces/comentario-confirm-dialog-data';
import { DialogsModule } from '../dialogs.module';
import { ComentarioConfirmDialogComponent } from './comentario-confirm-dialog.component';

describe('ComentarioConfirmDialogComponent', () => {
  let component: ComentarioConfirmDialogComponent;
  let fixture: ComponentFixture<ComentarioConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, DialogsModule],
      providers: [
        { provide: MatDialogRef, useValue: MatDialog },
        { provide: MAT_DIALOG_DATA, useValue: { message: '¿Está seguro?' } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ComentarioConfirmDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ComentarioConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with required', () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockRequiredComentarioConfirmDialogData,
    });
    fixture = TestBed.createComponent(ComentarioConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
