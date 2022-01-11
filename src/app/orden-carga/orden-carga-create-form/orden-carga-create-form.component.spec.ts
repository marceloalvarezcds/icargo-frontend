import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaCreateFormCombinacionComponent } from '../orden-carga-create-form-combinacion/orden-carga-create-form-combinacion.component';
import { OrdenCargaCreateFormInfoComponent } from '../orden-carga-create-form-info/orden-carga-create-form-info.component';

import { OrdenCargaCreateFormComponent } from './orden-carga-create-form.component';

describe('OrdenCargaCreateFormComponent', () => {
  let component: OrdenCargaCreateFormComponent;
  let fixture: ComponentFixture<OrdenCargaCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ OrdenCargaCreateFormComponent, OrdenCargaCreateFormCombinacionComponent, OrdenCargaCreateFormInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
