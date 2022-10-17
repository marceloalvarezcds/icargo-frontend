import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  mockSelectorInMapDialogData,
  SelectorInMapDialogData,
} from 'src/app/interfaces/dialog-data';
import { FleteList } from 'src/app/interfaces/flete';
import { MaterialModule } from 'src/app/material/material.module';

import { SelectorInMapDialogComponent } from './selector-in-map-dialog.component';

describe('SelectorInMapDialogComponent', () => {
  let component: SelectorInMapDialogComponent<FleteList>;
  let fixture: ComponentFixture<SelectorInMapDialogComponent<FleteList>>;
  const data = mockSelectorInMapDialogData;
  const mockDialogRefSpyObj = jasmine.createSpyObj({
    close: (data?: SelectorInMapDialogData<FleteList>) => {},
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SelectorInMapDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<SelectorInMapDialogComponent<FleteList>>(
      SelectorInMapDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
