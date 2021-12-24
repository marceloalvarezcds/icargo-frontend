import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockTipoConceptoDescuentoList } from 'src/app/interfaces/tipo-concepto-descuento';
import { MaterialModule } from 'src/app/material/material.module';

import { TipoConceptoDescuentoFieldComponent } from './tipo-concepto-descuento-field.component';

const createFormGroup = (component: TipoConceptoDescuentoFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('TipoConceptoDescuentoFieldComponent', () => {
  let component: TipoConceptoDescuentoFieldComponent;
  let fixture: ComponentFixture<TipoConceptoDescuentoFieldComponent>;
  const concepto1 = mockTipoConceptoDescuentoList[0];
  const concepto2 = mockTipoConceptoDescuentoList[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TipoConceptoDescuentoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConceptoDescuentoFieldComponent);
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
    expect(component.compareWith(concepto1, concepto1)).toBeTruthy();
    expect(component.compareWith(concepto1)).toBeFalsy();
    expect(component.compareWith(concepto1, concepto2)).toBeFalsy();
    expect(component.compareWith(undefined, concepto2)).toBeFalsy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
