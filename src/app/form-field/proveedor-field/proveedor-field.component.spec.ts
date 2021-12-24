import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockProveedorList } from 'src/app/interfaces/proveedor';
import { MaterialModule } from 'src/app/material/material.module';

import { ProveedorFieldComponent } from './proveedor-field.component';

const createFormGroup = (component: ProveedorFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('ProveedorFieldComponent', () => {
  let component: ProveedorFieldComponent;
  let fixture: ComponentFixture<ProveedorFieldComponent>;
  const o1 = mockProveedorList[0];
  const o2 = mockProveedorList[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ProveedorFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorFieldComponent);
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

  it('compareWith should options undefined', () => {
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compareWithSpy = spyOn(component, 'compareWith').and.callThrough();
    expect(component.compareWith()).toBeTruthy();
    expect(component.compareWith(o1, o1)).toBeTruthy();
    expect(component.compareWith(o1)).toBeFalsy();
    expect(component.compareWith(o1, o2)).toBeFalsy();
    expect(component.compareWith(undefined, o2)).toBeFalsy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
