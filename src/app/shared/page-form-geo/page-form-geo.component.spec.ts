import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockRemitenteList } from 'src/app/interfaces/remitente';
import { MaterialModule } from 'src/app/material/material.module';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { findElement, mockMapMouseEvent } from 'src/app/utils/test';

import { PageFormGeoComponent } from './page-form-geo.component';

describe('PageFormGeoComponent', () => {
  let component: PageFormGeoComponent;
  let fixture: ComponentFixture<PageFormGeoComponent>;
  let googleMapComponentComponent: DebugElement;
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
      declarations: [ PageFormGeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFormGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should pass form input', fakeAsync(() => {
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
    component.latitudControl.setValue(remitente.latitud);
    component.longitudControl.setValue(remitente.longitud);
    tick();
    googleMapComponentComponent = findElement(fixture, 'app-google-map');
    googleMapComponentComponent.triggerEventHandler('mapClick', mockMapMouseEvent);
    flush();
    expect(updateMarkerPositionSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  }));
});
