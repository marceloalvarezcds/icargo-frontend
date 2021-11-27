import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockTipoPersonaList } from 'src/app/interfaces/tipo-persona';
import { MaterialModule } from 'src/app/material/material.module';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { TipoPersonaFieldComponent } from './tipo-persona-field.component';

const createFormGroup = (component: TipoPersonaFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('TipoPersonaFieldComponent', () => {
  let component: TipoPersonaFieldComponent;
  let fixture: ComponentFixture<TipoPersonaFieldComponent>;
  let httpController: HttpTestingController;
  let matSelect: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ TipoPersonaService ],
      declarations: [ TipoPersonaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TipoPersonaFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with form', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/tipo_persona/`).flush(mockTipoPersonaList);
    createFormGroup(component);
    fixture.detectChanges();
    flush();
    matSelect = findElement(fixture, 'mat-select');
    matSelect.triggerEventHandler('selectionChange', { value: 1 });
    matSelect.triggerEventHandler('selectionChange', { value: 2 });
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
