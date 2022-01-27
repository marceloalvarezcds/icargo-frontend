import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { createFormGroup } from 'src/app/utils/form-field-test';

import { ProveedorByInsumoFieldComponent } from './proveedor-by-insumo-field.component';

describe('ProveedorByInsumoFieldComponent', () => {
  let component: ProveedorByInsumoFieldComponent;
  let fixture: ComponentFixture<ProveedorByInsumoFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ProveedorByInsumoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorByInsumoFieldComponent);
    component = fixture.componentInstance;
    createFormGroup(component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
