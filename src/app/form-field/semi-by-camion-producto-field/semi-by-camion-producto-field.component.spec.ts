import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { findElement } from 'src/app/utils/test';

import { SemiByCamionProductoFieldComponent } from './semi-by-camion-producto-field.component';

const createFormGroup = (component: SemiByCamionProductoFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('SemiByCamionProductoFieldComponent', () => {
  let component: SemiByCamionProductoFieldComponent;
  let fixture: ComponentFixture<SemiByCamionProductoFieldComponent>;
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
      declarations: [ SemiByCamionProductoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiByCamionProductoFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.camionId = undefined;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with camionId = 1', () => {
    component.camionId = 1;
    fixture.detectChanges();
    createFormGroup(component);
    fixture.detectChanges();
    matSelect = findElement(fixture, 'mat-select');
    matSelect.triggerEventHandler('selectionChange', { value: 1 });
    matSelect.triggerEventHandler('selectionChange', { value: 2 });
    expect(component).toBeTruthy();
  });
});
