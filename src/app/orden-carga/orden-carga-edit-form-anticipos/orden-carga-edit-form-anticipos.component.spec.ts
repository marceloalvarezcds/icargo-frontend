import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaEditFormAnticiposComponent } from './orden-carga-edit-form-anticipos.component';

describe('OrdenCargaEditFormAnticiposComponent', () => {
  let component: OrdenCargaEditFormAnticiposComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormAnticiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ OrdenCargaEditFormAnticiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaEditFormAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
