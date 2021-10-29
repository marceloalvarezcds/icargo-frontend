import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { mockCiudadList } from 'src/app/interfaces/ciudad';
import { mockLocalidadList } from 'src/app/interfaces/localidad';
import { mockPaisList } from 'src/app/interfaces/pais';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { findElement, mockMapMouseEvent } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { CentrosOperativosFormGeoComponent } from './centros-operativos-form-geo.component';

describe('CentrosOperativosFormGeoComponent', () => {
  let component: CentrosOperativosFormGeoComponent;
  let fixture: ComponentFixture<CentrosOperativosFormGeoComponent>;
  let httpController: HttpTestingController;
  let ciudadService: CiudadService;
  let localidadService: LocalidadService;
  let googleMapComponentComponent: DebugElement;
  const centroOperativo = mockCentroOperativoList[0];

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
      declarations: [ CentrosOperativosFormGeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    ciudadService = TestBed.inject(CiudadService);
    localidadService = TestBed.inject(LocalidadService);
    fixture = TestBed.createComponent(CentrosOperativosFormGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should pass form input', fakeAsync(() => {
    const ciudadServiceSpy = spyOn(ciudadService, 'getList').and.callThrough();
    const localidadServiceSpy = spyOn(localidadService, 'getList').and.callThrough();
    const updateMarkerPositionSpy = spyOn(component, 'updateMarkerPosition').and.callThrough();
    component.form = new FormGroup({
      info: new FormGroup({
        nombre: new FormControl(null),
      }),
      geo: new FormGroup({
        pais_id: new FormControl(null),
        localidad_id: new FormControl(null),
        ciudad_id: new FormControl(null),
        latitud: new FormControl(null),
        longitud: new FormControl(null),
        direccion: new FormControl(null),
      }),
    });
    fixture.detectChanges();
    component.paisControl.setValue(centroOperativo.ciudad.localidad.pais_id);
    component.localidadControl.setValue(centroOperativo.ciudad.localidad_id);
    component.latitudControl.setValue(centroOperativo.latitud);
    component.longitudControl.setValue(centroOperativo.longitud);
    tick();
    googleMapComponentComponent = findElement(fixture, 'app-google-map');
    googleMapComponentComponent.triggerEventHandler('mapClick', mockMapMouseEvent);
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/localidad/${centroOperativo.ciudad.localidad.pais_id}/`).flush(mockLocalidadList);
    httpController.expectOne(`${environment.api}/ciudad/${centroOperativo.ciudad.localidad_id}/`).flush(mockCiudadList);
    flush();
    expect(ciudadServiceSpy).toHaveBeenCalled();
    expect(localidadServiceSpy).toHaveBeenCalled();
    expect(updateMarkerPositionSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
