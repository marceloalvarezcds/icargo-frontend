import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { mockMovimientosSelectedDialogData } from 'src/app/interfaces/movimientos-selected-dialog';
import { MovimientosSelectedDialogComponent } from './movimientos-selected-dialog.component';

describe('MovimientosSelectedDialogComponent', () => {
  let component: MovimientosSelectedDialogComponent;
  let fixture: ComponentFixture<MovimientosSelectedDialogComponent>;
  const mockDialogRefSpyObj = jasmine.createSpyObj({
    close: (confirm: boolean) => confirm,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        DialogsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockMovimientosSelectedDialogData,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MovimientosSelectedDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosSelectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
