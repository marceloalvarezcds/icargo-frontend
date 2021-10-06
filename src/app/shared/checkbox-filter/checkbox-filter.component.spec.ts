import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { CheckboxFilterComponent } from './checkbox-filter.component';

describe('CheckboxFilterComponent', () => {
  let component: CheckboxFilterComponent;
  let fixture: ComponentFixture<CheckboxFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CheckboxFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute setAll', () => {
    component.list = ['filter1', 'filter2'];
    component.value = ['filter1'];
    component.updateAllChecked();
    component.setAll(true);
    component.setAll(false);
    const filtered = component.getFilteredList();
    expect(filtered).toEqual([]);
  });
});
