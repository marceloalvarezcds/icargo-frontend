import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaEditFormEstadoHistorialComponent } from './orden-carga-edit-form-estado-historial.component';

describe('OrdenCargaEditFormEstadoHistorialComponent', () => {
  let component: OrdenCargaEditFormEstadoHistorialComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormEstadoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [OrdenCargaEditFormEstadoHistorialComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrdenCargaEditFormEstadoHistorialComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
