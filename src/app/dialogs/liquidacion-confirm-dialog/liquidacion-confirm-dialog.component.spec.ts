import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockLiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogsModule } from '../dialogs.module';
import { LiquidacionConfirmDialogComponent } from './liquidacion-confirm-dialog.component';

describe('LiquidacionConfirmDialogComponent', () => {
  let component: LiquidacionConfirmDialogComponent;
  let fixture: ComponentFixture<LiquidacionConfirmDialogComponent>;
  const mockDialogRefSpyObj = jasmine.createSpyObj({
    close: (confirm: boolean) => confirm,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DialogsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockLiquidacionConfirmDialogData,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionConfirmDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
