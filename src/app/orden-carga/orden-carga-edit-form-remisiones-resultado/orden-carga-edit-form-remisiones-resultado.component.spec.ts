import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaEditFormRemisionesResultadoComponent } from './orden-carga-edit-form-remisiones-resultado.component';

describe('OrdenCargaEditFormRemisionesResultadoComponent', () => {
  let component: OrdenCargaEditFormRemisionesResultadoComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormRemisionesResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [OrdenCargaEditFormRemisionesResultadoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrdenCargaEditFormRemisionesResultadoComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
