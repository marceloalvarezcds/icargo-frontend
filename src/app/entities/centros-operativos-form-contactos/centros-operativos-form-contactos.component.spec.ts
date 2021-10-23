import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CentroOperativoContactoGestorCargaList, mockCentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { TableEvent } from 'src/app/interfaces/table';
import { MaterialModule } from 'src/app/material/material.module';
import { findElement } from 'src/app/utils/test';

import { CentrosOperativosFormContactosComponent } from './centros-operativos-form-contactos.component';

describe('CentrosOperativosFormContactosComponent', () => {
  let component: CentrosOperativosFormContactosComponent;
  let fixture: ComponentFixture<CentrosOperativosFormContactosComponent>;
  let tableComponent: DebugElement;
  const centroOperativoContacto = mockCentroOperativoContactoGestorCargaList[0];
  const confirmationDialogSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });
  const contactoFormDialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(centroOperativoContacto) });
  const tableEvent: TableEvent<CentroOperativoContactoGestorCargaList> = {
    row: centroOperativoContacto,
    index: 0,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CentrosOperativosFormContactosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrosOperativosFormContactosComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contactos: new FormArray([]),
    });
    component.contactoList = mockCentroOperativoContactoGestorCargaList;
    fixture.detectChanges();
    tableComponent = findElement(fixture, 'app-table');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete', fakeAsync(() => {
    const confirmationDialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(confirmationDialogSpyObj);
    const removeContactoSpy = spyOn(component, 'removeContacto').and.callThrough();
    tableComponent.triggerEventHandler('deleteClick', tableEvent);
    expect(removeContactoSpy).toHaveBeenCalled();
    expect(confirmationDialogSpy).toHaveBeenCalled();
  }));

  it('should add and edit', fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector('#add-button');
    const contactoFormDialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(contactoFormDialogRefSpyObj);
    const addContactoSpy = spyOn(component, 'addContacto').and.callThrough();
    const editContactoSpy = spyOn(component, 'editContacto').and.callThrough();
    tableComponent.triggerEventHandler('editClick', tableEvent);
    tableComponent.triggerEventHandler('showClick', tableEvent);
    button.click();
    tick();
    expect(addContactoSpy).toHaveBeenCalled();
    expect(editContactoSpy).toHaveBeenCalled();
    expect(contactoFormDialogSpy).toHaveBeenCalled();
    component.columns.forEach(c => c.value && c.value(centroOperativoContacto));
  }));
});
