import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockTipoConceptoComplementoList } from 'src/app/interfaces/tipo-concepto-complemento';
import { MaterialModule } from 'src/app/material/material.module';

import { TipoConceptoComplementoFieldComponent } from './tipo-concepto-complemento-field.component';

const createFormGroup = (component: TipoConceptoComplementoFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('TipoConceptoComplementoFieldComponent', () => {
  let component: TipoConceptoComplementoFieldComponent;
  let fixture: ComponentFixture<TipoConceptoComplementoFieldComponent>;
  const concepto1 = mockTipoConceptoComplementoList[0];
  const concepto2 = mockTipoConceptoComplementoList[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TipoConceptoComplementoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConceptoComplementoFieldComponent);
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
