import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockOcRemisionOrigenDialogData, mockOcRemisionOrigenDialogDataWithoutItem, OcRemisionOrigenDialogData } from 'src/app/interfaces/oc-remision-origen-dialog-data';
import { mockUnidadList } from 'src/app/interfaces/unidad';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import { OcRemisionOrigenFormDialogComponent } from './oc-remision-origen-form-dialog.component';

describe('OcRemisionOrigenFormDialogComponent', () => {
  let component: OcRemisionOrigenFormDialogComponent;
  let fixture: ComponentFixture<OcRemisionOrigenFormDialogComponent>;
  let httpController: HttpTestingController;
  let userService: UserService;
  const dialogData = mockOcRemisionOrigenDialogData;
  const data = dialogData.item!;
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close : (data?: OcRemisionOrigenDialogData) => {} });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
      ],
      providers: [
        AuthService,
        UserService,
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ OcRemisionOrigenFormDialogComponent ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(OcRemisionOrigenFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(OcRemisionOrigenFormDialogComponent);
    component = fixture.componentInstance;
    (userService as any).userSubject.next(mockUser);
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockOcRemisionOrigenDialogDataWithoutItem });
    fixture = TestBed.createComponent(OcRemisionOrigenFormDialogComponent);
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
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockOcRemisionOrigenDialogDataWithoutItem });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OcRemisionOrigenFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      numero_documento: data?.numero_documento,
      cantidad: data.cantidad,
      unidad_id: data.unidad_id,
      foto_documento: data.foto_documento,
    });
    httpController.match(`${environment.api}/unidad/`).forEach(r => r.flush(mockUnidadList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController.match(`${environment.api}/orden_carga_remision_origen/`).forEach(r => r.flush(data));
    httpController.verify();
  }));
});
