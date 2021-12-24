import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockTipoAnticipoList } from 'src/app/interfaces/tipo-anticipo';
import { MaterialModule } from 'src/app/material/material.module';

import { TipoAnticipoFieldComponent } from './tipo-anticipo-field.component';

const createFormGroup = (component: TipoAnticipoFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('TipoAnticipoFieldComponent', () => {
  let component: TipoAnticipoFieldComponent;
  let fixture: ComponentFixture<TipoAnticipoFieldComponent>;
  const tipo1 = mockTipoAnticipoList[0];
  const tipo2 = mockTipoAnticipoList[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TipoAnticipoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAnticipoFieldComponent);
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
    expect(component.compareWith(tipo1, tipo1)).toBeTruthy();
    expect(component.compareWith(tipo1)).toBeFalsy();
    expect(component.compareWith(tipo1, tipo2)).toBeFalsy();
    expect(component.compareWith(undefined, tipo2)).toBeFalsy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
