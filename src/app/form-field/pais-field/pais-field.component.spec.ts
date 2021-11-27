import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { PaisService } from 'src/app/services/pais.service';
import { findElement } from 'src/app/utils/test';
import { PaisFieldComponent } from './pais-field.component';

const createFormGroup = (component: PaisFieldComponent): void => {
  component.groupName = 'grupo';
  component.controlName = 'pais';
  component.form = new FormGroup({
    grupo: new FormGroup({
      pais: new FormControl(null),
    }),
  });
}

describe('PaisFieldComponent', () => {
  let component: PaisFieldComponent;
  let fixture: ComponentFixture<PaisFieldComponent>;
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
      providers: [ PaisService ],
      declarations: [ PaisFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaisFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with form', () => {
    createFormGroup(component);
    fixture.detectChanges();
    matSelect = findElement(fixture, 'mat-select');
    matSelect.triggerEventHandler('selectionChange', { value: 1 });
    matSelect.triggerEventHandler('selectionChange', { value: 2 });
    expect(component).toBeTruthy();
  });
});
