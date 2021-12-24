import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { FleteDescuento, mockFleteDescuentoList } from 'src/app/interfaces/flete-descuento';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { findElement } from 'src/app/utils/test';

import { FleteFormDescuentosComponent } from './flete-form-descuentos.component';

describe('FleteFormDescuentosComponent', () => {
  let component: FleteFormDescuentosComponent;
  let fixture: ComponentFixture<FleteFormDescuentosComponent>;
  let tableComponent: DebugElement;
  const row = mockFleteDescuentoList[0];
  const confirmationDialogSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  const formDialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(row) });
  const tableEvent: TableEvent<FleteDescuento> = { row, index: 0 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FleteFormDescuentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteFormDescuentosComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      descuentos: new FormArray([]),
    });
    component.descuentoList = mockFleteDescuentoList;
    fixture.detectChanges();
    tableComponent = findElement(fixture, 'app-table');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete', fakeAsync(() => {
    const confirmationDialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(confirmationDialogSpyObj);
    const removeSpy = spyOn(component, 'remove').and.callThrough();
    tableComponent.triggerEventHandler('deleteClick', tableEvent);
    tick();
    expect(removeSpy).toHaveBeenCalled();
    expect(confirmationDialogSpy).toHaveBeenCalled();
  }));

  it('should create and edit', fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector('#create-button');
    const formDialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(formDialogRefSpyObj);
    const createSpy = spyOn(component, 'create').and.callThrough();
    const editSpy = spyOn(component, 'edit').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    button.click();
    tick();
    expect(createSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(formDialogSpy).toHaveBeenCalled();
    mockFleteDescuentoList.forEach(it => component.columns.forEach(c => c.value && c.value(it)));
  }));
});
