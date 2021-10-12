import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockContacto } from 'src/app/interfaces/contacto';
import { MaterialModule } from 'src/app/material/material.module';

import { ContactoFormDialogComponent } from './contacto-form-dialog.component';

describe('ContactoFormDialogComponent', () => {
  let component: ContactoFormDialogComponent;
  let fixture: ComponentFixture<ContactoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: MatDialog },
        { provide: MAT_DIALOG_DATA, useValue: mockContacto },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ContactoFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
