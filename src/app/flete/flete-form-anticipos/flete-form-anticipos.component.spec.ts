import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from 'src/app/dialogs/dialogs.module';
import { mockFleteAnticipoList } from 'src/app/interfaces/flete-anticipo';
import { mockTipoAnticipoList } from 'src/app/interfaces/tipo-anticipo';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';
import { FleteFormAnticiposComponent } from './flete-form-anticipos.component';

describe('FleteFormAnticiposComponent', () => {
  let component: FleteFormAnticiposComponent;
  let fixture: ComponentFixture<FleteFormAnticiposComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        DialogsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [FleteFormAnticiposComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FleteFormAnticiposComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      anticipos: new FormArray([]),
    });
    component.anticipoList = mockFleteAnticipoList;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController
      .match(`${environment.api}/flete_anticipo/tipo_anticipo_insumo`)
      .forEach((r) => r.flush(mockTipoAnticipoList));
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
