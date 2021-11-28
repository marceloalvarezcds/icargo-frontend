import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { findElement } from 'src/app/utils/test';

import { CiudadFieldComponent } from './ciudad-field.component';

const createFormGroup = (component: CiudadFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'ciudad';
  component.form = new FormGroup({
    grupo: new FormGroup({
      ciudad: new FormControl(null),
    }),
  });
}

describe('CiudadFieldComponent', () => {
  let component: CiudadFieldComponent;
  let fixture: ComponentFixture<CiudadFieldComponent>;
  let matSelect: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ CiudadService ],
      declarations: [ CiudadFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.localidadId = undefined;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with localidadId = 1', () => {
    component.localidadId = 1;
    fixture.detectChanges();
    createFormGroup(component);
    fixture.detectChanges();
    matSelect = findElement(fixture, 'mat-select');
    matSelect.triggerEventHandler('selectionChange', { value: 1 });
    matSelect.triggerEventHandler('selectionChange', { value: 2 });
    expect(component).toBeTruthy();
  });
});
