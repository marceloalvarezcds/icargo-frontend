import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { CentrosOperativosFormContactosComponent } from './centros-operativos-form-contactos.component';

describe('CentrosOperativosFormContactosComponent', () => {
  let component: CentrosOperativosFormContactosComponent;
  let fixture: ComponentFixture<CentrosOperativosFormContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: MatDialog },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CentrosOperativosFormContactosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrosOperativosFormContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
