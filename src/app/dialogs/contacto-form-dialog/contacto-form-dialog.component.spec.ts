import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { mockCargoList } from 'src/app/interfaces/cargo';
import { mockCentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { mockContacto } from 'src/app/interfaces/contacto';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { ContactoFormDialogComponent } from './contacto-form-dialog.component';

describe('ContactoFormDialogComponent', () => {
  let component: ContactoFormDialogComponent;
  let fixture: ComponentFixture<ContactoFormDialogComponent>;
  let httpController: HttpTestingController;
  let userService: UserService;
  const cargo1 = mockCargoList[0];
  const cargo2 = mockCargoList[1];
  const contacto = mockCentroOperativoContactoGestorCargaList[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DirectivesModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
      ],
      providers: [
        AuthService,
        UserService,
        { provide: MatDialogRef, useValue: { close: (v: any) => {} } },
        { provide: MAT_DIALOG_DATA, useValue: contacto },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ContactoFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpController = TestBed.inject(HttpTestingController);
    httpController
      .expectOne(`${environment.api}/cargo/active_list`)
      .flush(mockCargoList);
    expect(component).toBeTruthy();
    httpController.verify();
  });

  it('should submitted', fakeAsync(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    (userService as any).userSubject.next(mockUser);
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');

    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    tick(1000); // AutofocusDirective directive
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');

    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
    tick(1000); // AutofocusDirective directive
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    const telefono = contacto.contacto_telefono;
    const email = contacto.contacto_email;

    component.form.setValue({
      telefono,
      email,
      nombre: contacto.contacto_nombre,
      apellido: contacto.contacto_apellido,
      alias: contacto.alias,
      cargo: contacto.cargo,
    });
    component.emailBlur$.next(true);
    component.telefonoBlur$.next(true);
    tick();

    httpController
      .expectOne(`${environment.api}/cargo/active_list`)
      .flush(mockCargoList);
    httpController
      .expectOne(`${environment.api}/contacto/${telefono}/${email}`)
      .flush(mockContacto);
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
    tick(1000); // AutofocusDirective directive
  }));

  it('compareWith should options undefined', () => {
    fixture = TestBed.createComponent(ContactoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compareWithSpy = spyOn(component, 'compareWith').and.callThrough();
    expect(component.compareWith()).toBeTruthy();
    expect(component.compareWith(cargo1, cargo1)).toBeTruthy();
    expect(component.compareWith(cargo1)).toBeFalsy();
    expect(component.compareWith(cargo1, cargo2)).toBeFalsy();
    expect(component.compareWith(undefined, cargo2)).toBeFalsy();
    expect(compareWithSpy).toHaveBeenCalled();
  });
});
