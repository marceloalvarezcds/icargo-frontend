import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { FleteComplemento, mockFleteComplementoList } from 'src/app/interfaces/flete-complemento';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { findElement } from 'src/app/utils/test';

import { FleteFormComplementosComponent } from './flete-form-complementos.component';

describe('FleteFormComplementosComponent', () => {
  let component: FleteFormComplementosComponent;
  let fixture: ComponentFixture<FleteFormComplementosComponent>;
  let tableComponent: DebugElement;
  const row = mockFleteComplementoList[0];
  const confirmationDialogSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  const formDialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(row) });
  const tableEvent: TableEvent<FleteComplemento> = { row, index: 0 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FleteFormComplementosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteFormComplementosComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      complementos: new FormArray([]),
    });
    component.complementoList = mockFleteComplementoList;
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
    mockFleteComplementoList.forEach(it => component.columns.forEach(c => c.value && c.value(it)));
  }));
});
