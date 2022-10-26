import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { OrdenCargaEditFormAnticiposFleteComponent } from './orden-carga-edit-form-anticipos-flete.component';

describe('OrdenCargaEditFormAnticiposFleteComponent', () => {
  let component: OrdenCargaEditFormAnticiposFleteComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormAnticiposFleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [OrdenCargaEditFormAnticiposFleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrdenCargaEditFormAnticiposFleteComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
