import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUserPuntoVentaCreateFormDialogData } from 'src/app/interfaces/user-punto-venta';
import { MaterialModule } from 'src/app/material/material.module';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { UserPuntoVentaCreateFormDialogComponent } from './user-punto-venta-create-form-dialog.component';

describe('UserPuntoVentaCreateFormDialogComponent', () => {
  let component: UserPuntoVentaCreateFormDialogComponent;
  let fixture: ComponentFixture<UserPuntoVentaCreateFormDialogComponent>;
  const dialogData = mockUserPuntoVentaCreateFormDialogData;
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close: () => {} });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
      ],
      providers: [
        PuntoVentaService,
        SnackbarService,
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UserPuntoVentaCreateFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPuntoVentaCreateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
