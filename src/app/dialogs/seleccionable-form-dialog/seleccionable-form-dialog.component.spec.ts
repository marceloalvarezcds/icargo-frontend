import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { MaterialModule } from 'src/app/material/material.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  mockSeleccionableFormDialogData,
  mockSeleccionableFormDialogDataWithoutItem,
} from 'src/app/interfaces/seleccionable-form-dialog-data';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { environment } from 'src/environments/environment';
import { SeleccionableFormDialogComponent } from './seleccionable-form-dialog.component';
import { SeleccionableFormDialogService } from './seleccionable-form-dialog.service';

describe('SeleccionableFormDialogComponent', () => {
  let component: SeleccionableFormDialogComponent;
  let fixture: ComponentFixture<SeleccionableFormDialogComponent>;
  let httpController: HttpTestingController;
  const dialogData = mockSeleccionableFormDialogData;
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
        SeleccionableService,
        SeleccionableFormDialogService,
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SeleccionableFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SeleccionableFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SeleccionableFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    httpController
      .match(`${environment.api}/${m.CARGO}/${data.id}`)
      .forEach((r) => r.flush(data));
    flush();
    httpController.verify();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockSeleccionableFormDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(SeleccionableFormDialogComponent);
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
      useValue: mockSeleccionableFormDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SeleccionableFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.setValue({
      descripcion: data.descripcion,
      gestor_carga_id: null,
    });
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/${m.CARGO}/`)
      .forEach((r) => r.flush(data));
    flush();
    httpController.verify();
  }));
});
