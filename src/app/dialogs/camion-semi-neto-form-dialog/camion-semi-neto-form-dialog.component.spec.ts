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
import { mockCamionSemiNetoFormDialogData } from 'src/app/interfaces/camion-semi-neto-form-dialog-data';
import { mockMovimientoFormDialogDataWithoutItem } from 'src/app/interfaces/movimiento-form-dialog-data';
import { mockProductoList } from 'src/app/interfaces/producto';
import { mockSemiList } from 'src/app/interfaces/semi';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';
import { DialogsModule } from '../dialogs.module';
import { CamionSemiNetoFormDialogComponent } from './camion-semi-neto-form-dialog.component';

describe('CamionSemiNetoFormDialogComponent', () => {
  let component: CamionSemiNetoFormDialogComponent;
  let fixture: ComponentFixture<CamionSemiNetoFormDialogComponent>;
  let httpController: HttpTestingController;
  const dialogData = mockCamionSemiNetoFormDialogData;
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
        { provide: MatDialogRef, useValue: mockDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CamionSemiNetoFormDialogComponent],
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(CamionSemiNetoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submitted', fakeAsync(() => {
    fixture = TestBed.createComponent(CamionSemiNetoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockMovimientoFormDialogDataWithoutItem,
    });
    fixture = TestBed.createComponent(CamionSemiNetoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();
    tick();
    expect(component.form.valid).toBeFalsy();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('data should be null and should submitted', fakeAsync(() => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: mockMovimientoFormDialogDataWithoutItem,
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CamionSemiNetoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#submit-button');
    component.form.patchValue({
      camion_id: data.camion_id,
      semi_id: data.semi_id,
      neto: data.neto,
      producto_id: data.producto_id,
    });
    httpController
      .match(`${environment.api}/semi/`)
      .forEach((r) => r.flush(mockSemiList));
    httpController
      .match(`${environment.api}/producto/`)
      .forEach((r) => r.flush(mockProductoList));
    button.click();
    tick();
    expect(component.form.valid).toBeTruthy();
    expect(submitSpy).toHaveBeenCalled();
    httpController
      .match(`${environment.api}/camion_semi_neto/`)
      .forEach((r) => r.flush(data));
    httpController.verify();
  }));
});
