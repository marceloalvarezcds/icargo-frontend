import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaEditFormAnticiposSaldosComponent } from './orden-carga-edit-form-anticipos-saldos.component';

describe('OrdenCargaEditFormAnticiposSaldosComponent', () => {
  let component: OrdenCargaEditFormAnticiposSaldosComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormAnticiposSaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ OrdenCargaEditFormAnticiposSaldosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaEditFormAnticiposSaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
