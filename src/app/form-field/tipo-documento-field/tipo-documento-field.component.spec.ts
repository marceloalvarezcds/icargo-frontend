import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { MaterialModule } from 'src/app/material/material.module';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { TipoDocumentoFieldComponent } from './tipo-documento-field.component';

const createFormGroup = (component: TipoDocumentoFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('TipoDocumentoFieldComponent', () => {
  let component: TipoDocumentoFieldComponent;
  let fixture: ComponentFixture<TipoDocumentoFieldComponent>;
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
      providers: [ TipoDocumentoService ],
      declarations: [ TipoDocumentoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TipoDocumentoFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with form', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
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
