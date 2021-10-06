import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { findElement } from 'src/app/utils/test';
import { CheckboxFilterComponent } from '../checkbox-filter/checkbox-filter.component';

import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter.component';

describe('SearchableCheckboxFilterComponent', () => {
  let component: SearchableCheckboxFilterComponent;
  let fixture: ComponentFixture<SearchableCheckboxFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ SearchableCheckboxFilterComponent, CheckboxFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableCheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter', fakeAsync(() => {
    const spy = spyOn(component as any, 'filterData').and.callThrough();
    const el = fixture.nativeElement.querySelector('input');
    component.list = ['filter'];
    el.value = 'something';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));

  it('should click on the buttons', () => {
    fixture.detectChanges();
    const applyButton = findElement(fixture, '.apply-button');
    const resetButton = findElement(fixture, '.reset-button');
    const applySpy = spyOn(component, 'apply').and.callThrough();
    const resetSpy = spyOn(component, 'reset').and.callThrough();
    applyButton.triggerEventHandler('click', new MouseEvent('click'));
    resetButton.triggerEventHandler('click', new MouseEvent('click'));
    expect(applySpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });
});
