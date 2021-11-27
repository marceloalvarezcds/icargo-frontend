import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { UserService } from 'src/app/services/user.service';

import { OficialCuentaFieldComponent } from './oficial-cuenta-field.component';

const createFormGroup = (component: OficialCuentaFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

describe('OficialCuentaFieldComponent', () => {
  let component: OficialCuentaFieldComponent;
  let fixture: ComponentFixture<OficialCuentaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ AuthService, TipoRegistroService, UserService ],
      declarations: [ OficialCuentaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficialCuentaFieldComponent);
    component = fixture.componentInstance;
    createFormGroup(component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
