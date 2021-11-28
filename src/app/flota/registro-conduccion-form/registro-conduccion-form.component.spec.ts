import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoRegistroList } from 'src/app/interfaces/tipo-registro';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { RegistroConduccionFormComponent } from './registro-conduccion-form.component';

const createFormGroup = (component: RegistroConduccionFormComponent): void => {
  component.form = new FormGroup({
    registro: new FormGroup({
      pais_emisor_registro_id: new FormControl(null),
      localidad_emisor_registro_id: new FormControl(null),
      ciudad_emisor_registro_id: new FormControl(null),
      tipo_registro_id: new FormControl(null),
      numero_registro: new FormControl(null),
      vencimiento_registro: new FormControl(null),
      foto_registro_frente: new FormControl(null),
      foto_registro_reverso: new FormControl(null),
    }),
  });
}

describe('RegistroConduccionFormComponent', () => {
  let component: RegistroConduccionFormComponent;
  let fixture: ComponentFixture<RegistroConduccionFormComponent>;
  let httpController: HttpTestingController;
  const paisId = 1;
  const localidadId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormFieldModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        CiudadService,
        LocalidadService,
        PaisService,
        TipoRegistroService,
      ],
      declarations: [ RegistroConduccionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RegistroConduccionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass form input', fakeAsync(() => {
    createFormGroup(component);
    fixture.detectChanges();
    const paisField: DebugElement = findElement(fixture, 'app-pais-field');
    const localidadField: DebugElement = findElement(fixture, 'app-localidad-field');
    paisField.triggerEventHandler('valueChange', paisId);
    fixture.detectChanges();
    localidadField.triggerEventHandler('valueChange', localidadId);
    fixture.detectChanges();
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/tipo_registro/`).flush(mockTipoRegistroList);
    httpController.expectOne(`${environment.api}/localidad/${paisId}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${localidadId}/`).flush(mockCiudadList);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
