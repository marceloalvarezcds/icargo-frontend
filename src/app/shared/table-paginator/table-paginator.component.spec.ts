import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { pageOptions } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { TableService } from 'src/app/services/table.service';
import { findElement } from 'src/app/utils/test';
import { SharedModule } from '../shared.module';

import { TablePaginatorComponent } from './table-paginator.component';

describe('TablePaginatorComponent', () => {
  let component: TablePaginatorComponent;
  let fixture: ComponentFixture<TablePaginatorComponent>;
  let paginatorComponent: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        SharedModule,
      ],
      providers: [ TableService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TablePaginatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paginatorComponent = findElement(fixture, 'mat-paginator');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pageOptions changes', fakeAsync(() => {
    const setPageOptionsSpy = spyOn(component, 'setPageOptions').and.callThrough();
    paginatorComponent.triggerEventHandler('page', pageOptions);
    expect(setPageOptionsSpy).toHaveBeenCalled();
    tick(500);
    expect(component.pageOptions).toBe(pageOptions);
  }));
});
