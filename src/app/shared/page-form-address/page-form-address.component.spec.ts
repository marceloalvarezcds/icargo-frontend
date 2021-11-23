import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockRemitenteList } from 'src/app/interfaces/remitente';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { environment } from 'src/environments/environment';

import { PageFormAddressComponent } from './page-form-address.component';

describe('PageFormAddressComponent', () => {
  let component: PageFormAddressComponent;
  let fixture: ComponentFixture<PageFormAddressComponent>;
  let httpController: HttpTestingController;
  let ciudadService: CiudadService;
  let localidadService: LocalidadService;
  const remitente = mockRemitenteList[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        CiudadService,
        LocalidadService,
        PaisService,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PageFormAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    ciudadService = TestBed.inject(CiudadService);
    localidadService = TestBed.inject(LocalidadService);
    fixture = TestBed.createComponent(PageFormAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should pass form input', fakeAsync(() => {
    const ciudadServiceSpy = spyOn(ciudadService, 'getList').and.callThrough();
    const localidadServiceSpy = spyOn(localidadService, 'getList').and.callThrough();
    component.form = new FormGroup({
      address: new FormGroup({
        pais_id: new FormControl(null),
        localidad_id: new FormControl(null),
        ciudad_id: new FormControl(null),
        direccion: new FormControl(null),
      }),
    });
    fixture.detectChanges();
    component.paisControl.setValue(remitente.ciudad.localidad.pais_id);
    component.localidadControl.setValue(remitente.ciudad.localidad_id);
    tick();
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/localidad/${remitente.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${remitente.ciudad.localidad_id}/`).flush(mockCiudadList);
    flush();
    expect(ciudadServiceSpy).toHaveBeenCalled();
    expect(localidadServiceSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
