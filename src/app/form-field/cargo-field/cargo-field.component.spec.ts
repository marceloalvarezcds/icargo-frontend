import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { CargoFieldComponent } from './cargo-field.component';

describe('CargoFieldComponent', () => {
  let component: CargoFieldComponent;
  let fixture: ComponentFixture<CargoFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CargoFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoFieldComponent);
    component = fixture.componentInstance;
    (component.control = new FormControl(null)), fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
