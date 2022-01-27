import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { createFormGroup } from 'src/app/utils/form-field-test';

import { MonedaByInsumoPuntoVentaFieldComponent } from './moneda-by-insumo-punto-venta-field.component';

describe('MonedaByInsumoPuntoVentaFieldComponent', () => {
  let component: MonedaByInsumoPuntoVentaFieldComponent;
  let fixture: ComponentFixture<MonedaByInsumoPuntoVentaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ MonedaByInsumoPuntoVentaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaByInsumoPuntoVentaFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    createFormGroup(component);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create without groupName', () => {
    component.controlName = 'control';
    component.form = new FormGroup({
      control: new FormControl(null),
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
