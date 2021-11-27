import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { LocalidadService } from 'src/app/services/localidad.service';
import { findElement } from 'src/app/utils/test';

import { LocalidadFieldComponent } from './localidad-field.component';

const createFormGroup = (component: LocalidadFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'localidad';
  component.form = new FormGroup({
    grupo: new FormGroup({
      localidad: new FormControl(null),
    }),
  });
}

describe('LocalidadFieldComponent', () => {
  let component: LocalidadFieldComponent;
  let fixture: ComponentFixture<LocalidadFieldComponent>;
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
      providers: [ LocalidadService ],
      declarations: [ LocalidadFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalidadFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.paisId = undefined;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with paisId = 1', () => {
    component.paisId = 1;
    createFormGroup(component);
    fixture.detectChanges();
    matSelect = findElement(fixture, 'mat-select');
    matSelect.triggerEventHandler('selectionChange', { value: 1 });
    matSelect.triggerEventHandler('selectionChange', { value: 2 });
    expect(component).toBeTruthy();
  });
});
