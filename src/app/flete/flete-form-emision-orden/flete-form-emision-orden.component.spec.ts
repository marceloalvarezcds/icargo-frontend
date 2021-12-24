import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockFlete1 } from 'src/app/interfaces/flete';
import { mockFleteDestinatarioList } from 'src/app/interfaces/flete-destinatario';
import { MaterialModule } from 'src/app/material/material.module';

import { FleteFormEmisionOrdenComponent } from './flete-form-emision-orden.component';

describe('FleteFormEmisionOrdenComponent', () => {
  let component: FleteFormEmisionOrdenComponent;
  let fixture: ComponentFixture<FleteFormEmisionOrdenComponent>;
  const o1 = mockFleteDestinatarioList[0];
  const o2 = mockFleteDestinatarioList[1];

  function formSetValue(component: FleteFormEmisionOrdenComponent): void {
    component.form = new FormGroup({
      info: new FormGroup({
        remitente_id: new FormControl(mockFlete1.remitente_id),
      }),
      tramo: new FormGroup({
        origen_id: new FormControl(mockFlete1.origen_id),
        destino_id: new FormControl(mockFlete1.destino_id),
      }),
      emision_orden: new FormGroup({
        emision_orden_texto_legal: new FormControl(mockFlete1.emision_orden_texto_legal),
        emision_orden_detalle: new FormControl(mockFlete1.emision_orden_detalle),
        destinatarios: new FormControl(mockFlete1.destinatarios),
      }),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FleteFormEmisionOrdenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteFormEmisionOrdenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    formSetValue(component);
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
