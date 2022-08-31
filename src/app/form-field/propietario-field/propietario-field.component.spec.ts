import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPropietarioList } from 'src/app/interfaces/propietario';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';

import { PropietarioFieldComponent } from './propietario-field.component';

const createFormGroup = (component: PropietarioFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
};

describe('PropietarioFieldComponent', () => {
  let component: PropietarioFieldComponent;
  let fixture: ComponentFixture<PropietarioFieldComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PropietarioFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    createFormGroup(component);
    fixture.detectChanges();
    component.propietarioId = undefined;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId = 1', fakeAsync(() => {
    createFormGroup(component);
    fixture.detectChanges();
    httpController
      .match(`${environment.api}/propietario/gestor_cuenta`)
      .forEach((r) => r.flush(mockPropietarioList));
    component.propietarioId = 1;
    flush();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));
});
