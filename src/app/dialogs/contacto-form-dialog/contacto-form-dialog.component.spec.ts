import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { MaterialModule } from 'src/app/material/material.module';

import { ContactoFormDialogComponent } from './contacto-form-dialog.component';

describe('ContactoFormDialogComponent', () => {
  let component: ContactoFormDialogComponent;
  let fixture: ComponentFixture<ContactoFormDialogComponent>;
  const contacto = mockCentroOperativoContactoGestorCargaList[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: (v: any) => {} }},
        { provide: MAT_DIALOG_DATA, useValue: contacto },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ContactoFormDialogComponent ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');

    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');

    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');

    component.form.setValue({
      nombre: contacto.contacto_nombre,
      apellido: contacto.contacto_apellido,
      telefono: contacto.contacto_telefono,
      email: contacto.contacto_email,
      cargo: contacto.cargo,
    });

    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('compareWith should options undefined', () => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compareWithSpy = spyOn(component, 'compareWith').and.callThrough();
    expect(component.compareWith()).toBeTruthy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
