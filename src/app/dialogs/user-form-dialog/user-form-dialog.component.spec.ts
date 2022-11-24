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
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import {
  mockUserFormDialogData,
  mockUserFormDialogDataWithoutItem,
} from 'src/app/interfaces/user-form-dialog-data';
import { MaterialModule } from 'src/app/material/material.module';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { UserFormDialogComponent } from './user-form-dialog.component';
import { UserFormDialogService } from './user-form-dialog.service';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let fixture: ComponentFixture<UserFormDialogComponent>;
  let httpController: HttpTestingController;
  const dialogData = mockUserFormDialogData;
  const data = dialogData.item!;
  const mockDialogRefSpyObj = jasmine.createSpyObj({ close: () => {} });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        DialogsModule,
      ],
      providers: [
        UserService,
        UserFormDialogService,
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UserFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    httpController
      .match(`${environment.api}/user/${data.id}`)
      .forEach((r) => r.flush(data));
    flush();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockUserFormDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
    flush();
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockUserFormDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.patchValue({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      gestor_carga_id: data.gestor_carga_id,
    });
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/user/`)
      .forEach((r) => r.flush(data));
    flush();
    httpController.verify();
  }));
});
