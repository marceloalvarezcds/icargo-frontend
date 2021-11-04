import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { SearchService } from 'src/app/services/search.service';
import { SearchableCheckboxFilterComponent } from '../searchable-checkbox-filter/searchable-checkbox-filter.component';
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
      declarations: [ TableComponent, SearchableCheckboxFilterComponent ]
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
    component.columnsToShowList = ['filter'];
    expect(component).toBeTruthy();
  });

  it('should apply empty filter', fakeAsync(() => {
    const filterDataSpy = spyOn(component, 'filterData').and.callThrough();
    searchService.search('');
    flush();
    tick(500);
    expect(filterDataSpy).toHaveBeenCalled();
  }));
});
