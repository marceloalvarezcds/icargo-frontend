import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { SemiFormDetalleComponent } from './semi-form-detalle.component';

describe('SemiFormDetalleComponent', () => {
  let component: SemiFormDetalleComponent;
  let fixture: ComponentFixture<SemiFormDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ SemiFormDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiFormDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
