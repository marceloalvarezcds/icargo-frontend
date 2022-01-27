import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { createFormGroup } from 'src/app/utils/form-field-test';

import { TipoInsumoByFleteFieldComponent } from './tipo-insumo-by-flete-field.component';

describe('TipoInsumoByFleteFieldComponent', () => {
  let component: TipoInsumoByFleteFieldComponent;
  let fixture: ComponentFixture<TipoInsumoByFleteFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TipoInsumoByFleteFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoInsumoByFleteFieldComponent);
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
