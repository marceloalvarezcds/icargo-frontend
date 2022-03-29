import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MaterialModule } from 'src/app/material/material.module';

import { SelectableItemTableComponent } from './selectable-item-table.component';

describe('SelectableItemTableComponent', () => {
  let component: SelectableItemTableComponent<Movimiento>;
  let fixture: ComponentFixture<SelectableItemTableComponent<Movimiento>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SelectableItemTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<SelectableItemTableComponent<Movimiento>>(
      SelectableItemTableComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
