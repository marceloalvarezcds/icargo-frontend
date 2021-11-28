import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { fakeFileList } from 'src/app/utils/test';

import { FileFieldComponent } from './file-field.component';

const createFormGroup = (component: FileFieldComponent): void => {
  component.form = new FormGroup({
    grupo: new FormGroup({
      foto: new FormControl(null, Validators.required),
    }),
  });
  component.groupName = 'grupo';
  component.controlName = 'foto';
}

describe('FileFieldComponent', () => {
  let component: FileFieldComponent;
  let fixture: ComponentFixture<FileFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FileFieldComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with isEdit = true', () => {
    createFormGroup(component);
    component.isEdit = true;
    fixture.detectChanges();
    expect(component.fieldControl.hasValidator(Validators.required)).toBe(false);
  });

  it('should create with isEdit = false', () => {
    createFormGroup(component);
    component.isEdit = false;
    fixture.detectChanges();
    expect(component.fieldControl.hasValidator(Validators.required)).toBe(true);
  });

  it('should call to fieldChange', fakeAsync(() => {
    createFormGroup(component);
    fixture.detectChanges();
    const fieldChangeSpy = spyOn(component, 'fieldChange').and.callThrough();
    const input: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    input.files = fakeFileList;
    input.dispatchEvent(new Event('change'));
    tick();
    expect(fieldChangeSpy).toHaveBeenCalled();
  }));

  it('should call to fieldChange with empty files', fakeAsync(() => {
    createFormGroup(component);
    fixture.detectChanges();
    const fieldChangeSpy = spyOn(component, 'fieldChange').and.callThrough();
    const input: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    input.dispatchEvent(new Event('change'));
    tick();
    expect(fieldChangeSpy).toHaveBeenCalled();
  }));
});
