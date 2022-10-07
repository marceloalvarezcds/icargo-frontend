import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { createFormGroup } from 'src/app/utils/form-field-test';

import { TipoMovimientoByCuentaFieldComponent } from './tipo-movimiento-by-cuenta-field.component';

describe('TipoMovimientoByCuentaFieldComponent', () => {
  let component: TipoMovimientoByCuentaFieldComponent;
  let fixture: ComponentFixture<TipoMovimientoByCuentaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TipoMovimientoByCuentaFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMovimientoByCuentaFieldComponent);
    component = fixture.componentInstance;
    createFormGroup(component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
