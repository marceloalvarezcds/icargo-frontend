import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockMonedaList } from 'src/app/interfaces/moneda';
import { MaterialModule } from 'src/app/material/material.module';

import { MonedaFieldComponent } from './moneda-field.component';

const createFormGroup = (component: MonedaFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('MonedaFieldComponent', () => {
  let component: MonedaFieldComponent;
  let fixture: ComponentFixture<MonedaFieldComponent>;
  const moneda1 = mockMonedaList[0];
  const moneda2 = mockMonedaList[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ MonedaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaFieldComponent);
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
    expect(component.compareWith(moneda1, moneda1)).toBeTruthy();
    expect(component.compareWith(moneda1)).toBeFalsy();
    expect(component.compareWith(moneda1, moneda2)).toBeFalsy();
    expect(component.compareWith(undefined, moneda2)).toBeFalsy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
