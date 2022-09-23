import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FleteList } from 'src/app/interfaces/flete';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from '../shared.module';

import { TableSelectorWithFetchPaginatorComponent } from './table-selector-with-fetch-paginator.component';

describe('TableSelectorWithFetchPaginatorComponent', () => {
  let component: TableSelectorWithFetchPaginatorComponent<FleteList>;
  let fixture: ComponentFixture<
    TableSelectorWithFetchPaginatorComponent<FleteList>
  >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TableSelectorWithFetchPaginatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<
      TableSelectorWithFetchPaginatorComponent<FleteList>
    >(TableSelectorWithFetchPaginatorComponent);
    component = fixture.componentInstance;
    component.searchControl = new FormControl(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
