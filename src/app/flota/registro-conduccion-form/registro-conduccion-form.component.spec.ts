import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoRegistroList } from 'src/app/interfaces/tipo-registro';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { fakeFileList } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { RegistroConduccionFormComponent } from './registro-conduccion-form.component';

describe('RegistroConduccionFormComponent', () => {
  let component: RegistroConduccionFormComponent;
  let fixture: ComponentFixture<RegistroConduccionFormComponent>;
  let httpController: HttpTestingController;
  const paisId = 1;
  const localidadId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
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

  it('should create', fakeAsync(() => {
    component.paisControl.setValue(paisId);
    component.localidadControl.setValue(localidadId);
    tick();
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/tipo_registro/`).flush(mockTipoRegistroList);
    httpController.expectOne(`${environment.api}/localidad/${paisId}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${localidadId}/`).flush(mockCiudadList);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));

  it('should call to fotoRegistroChange', fakeAsync(() => {
    const fotoRegistroChangeSpy = spyOn(component, 'fotoRegistroChange').and.callThrough();
    const fotoRegistroInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-registro-input');
    fotoRegistroInput.files = fakeFileList;
    fotoRegistroInput.dispatchEvent(new Event('change'));
    tick();
    expect(fotoRegistroChangeSpy).toHaveBeenCalled();
  }));

  it('should call to fotoRegistroChange with empty files', fakeAsync(() => {
    const fotoRegistroChangeSpy = spyOn(component, 'fotoRegistroChange').and.callThrough();
    const fotoRegistroInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-registro-input');
    fotoRegistroInput.dispatchEvent(new Event('change'));
    tick();
    expect(fotoRegistroChangeSpy).toHaveBeenCalled();
  }));
});
