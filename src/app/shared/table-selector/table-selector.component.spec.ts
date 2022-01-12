import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FleteList } from 'src/app/interfaces/flete';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from '../shared.module';

import { TableSelectorComponent } from './table-selector.component';

describe('TableSelectorComponent', () => {
  let component: TableSelectorComponent<FleteList>;
  let fixture: ComponentFixture<TableSelectorComponent<FleteList>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TableSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TableSelectorComponent<FleteList>>(TableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
