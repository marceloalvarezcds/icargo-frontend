import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from '../shared.module';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let searchService: SearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        MatIconTestingModule,
        SharedModule,
      ],
      providers: [ SearchService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ TableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    searchService = TestBed.inject(SearchService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
