import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockCentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { mockCentroOperativoClasificacionList } from 'src/app/interfaces/centro-operativo-clasificacion';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { fakeFileList, findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { CentrosOperativosFormComponent } from './centros-operativos-form.component';

@Component({ template: '' })
class TestComponent { }

describe('CentrosOperativosFormComponent', () => {
  let component: CentrosOperativosFormComponent;
  let fixture: ComponentFixture<CentrosOperativosFormComponent>;
  let httpController: HttpTestingController;
  let centroOperativoService: CentroOperativoService;
  let pageFormComponent: DebugElement;
  const centroOperativo = mockCentroOperativoList[0];
  const router = {
    navigate: jasmine.createSpy('navigate'),
  }
  const createRouter = {
    ...router, url: 'entities/centros-operativos/create',
  }
  const editRouter = {
    ...router, url: 'entities/centros-operativos/edit',
  }
  const showRouter = {
    ...router, url: 'entities/centros-operativos/show',
  }
  const id = 1;
  const route = {
    snapshot: {
      params: {
        id,
      },
    },
  };
  const createRoute = {
    snapshot: {
      params: { },
    },
  };
  function formSetValue(component: CentrosOperativosFormComponent, logo: string | null = null): void {
    component.form.setValue({
      alias: 'Alias',
      nombre: centroOperativo.nombre,
      nombre_corto: centroOperativo.nombre_corto,
      clasificacion_id: centroOperativo.clasificacion_id,
      pais_id: centroOperativo.ciudad.localidad.pais_id,
      localidad_id: centroOperativo.ciudad.localidad_id,
      ciudad_id: centroOperativo.ciudad_id,
      latitud: centroOperativo.latitud,
      longitud: centroOperativo.longitud,
      direccion: centroOperativo.direccion,
      logo,
      contactos: [],
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'entities/centros-operativos/create', component: TestComponent },
          { path: 'entities/centros-operativos/edit', component: TestComponent },
          { path: 'entities/centros-operativos/show', component: TestComponent },
        ]),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        CentroOperativoService,
        CentroOperativoClasificacionService,
        CiudadService,
        LocalidadService,
        PaisService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router }
      ],
      declarations: [ CentrosOperativosFormComponent ]
    })
    .compileComponents();
  });

  it('should open create view', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: createRoute });
    TestBed.overrideProvider(Router, { useValue: createRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    component = fixture.componentInstance;
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    fixture.detectChanges();
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.files = fakeFileList;
    fileInput.dispatchEvent(new Event('change'));
    expect(component).toBeTruthy();
    pageFormComponent = findElement(fixture, 'app-page-form');
    formSetValue(component, 'logo');
    pageFormComponent.triggerEventHandler('backClick', true);
    httpController.expectOne(`${environment.api}/centro_operativo_clasificacion/`).flush(mockCentroOperativoClasificacionList);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    const req = httpController.expectOne(`${environment.api}/centro_operativo/`)
    expect(req.request.method).toBe('POST');
    req.flush(centroOperativo);
    flush();
    expect(fileChangeSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open edit view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: editRouter });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    centroOperativoService = TestBed.inject(CentroOperativoService);
    component = fixture.componentInstance;
    const getByIdSpy = spyOn(centroOperativoService, 'getById').and.callThrough();
    const submitSpy = spyOn(component, 'submit').and.callThrough();
    const backSpy = spyOn(component, 'back').and.callThrough();
    fixture.detectChanges();
    pageFormComponent = findElement(fixture, 'app-page-form');
    pageFormComponent.triggerEventHandler('backClick', true);
    tick();
    httpController.expectOne(`${environment.api}/centro_operativo/${id}`).flush(centroOperativo);
    httpController.expectOne(`${environment.api}/centro_operativo_clasificacion/`).flush(mockCentroOperativoClasificacionList);
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    flush();
    expect(backSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
    expect(getByIdSpy).toHaveBeenCalled();
    tick();
    formSetValue(component);
    pageFormComponent.triggerEventHandler('backClick', true);
    const req = httpController.expectOne(`${environment.api}/centro_operativo/${id}`)
    expect(req.request.method).toBe('PUT');
    req.flush(centroOperativo);
    flush();
    expect(submitSpy).toHaveBeenCalled();
    httpController.verify();
  }));

  it('should open show view', fakeAsync(() => {
    TestBed.overrideProvider(Router, { useValue: showRouter });
    fixture = TestBed.createComponent(CentrosOperativosFormComponent);
    component = fixture.componentInstance;
    pageFormComponent = findElement(fixture, 'app-page-form');
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    fixture.detectChanges();
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.dispatchEvent(new Event('change'));
    const backSpy = spyOn(component, 'back').and.callThrough();
    pageFormComponent.triggerEventHandler('backClick', false);
    expect(backSpy).toHaveBeenCalled();
    expect(fileChangeSpy).toHaveBeenCalled();
  }));
});
