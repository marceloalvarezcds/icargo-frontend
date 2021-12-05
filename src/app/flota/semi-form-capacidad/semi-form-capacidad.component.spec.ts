import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { SemiFormCapacidadComponent } from './semi-form-capacidad.component';

describe('SemiFormCapacidadComponent', () => {
  let component: SemiFormCapacidadComponent;
  let fixture: ComponentFixture<SemiFormCapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ SemiFormCapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiFormCapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
