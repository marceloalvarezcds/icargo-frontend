import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { OrdenCargaEditFormAccionesComponent } from '../orden-carga-edit-form-acciones/orden-carga-edit-form-acciones.component';
import { OrdenCargaEditFormAnticiposComponent } from '../orden-carga-edit-form-anticipos/orden-carga-edit-form-anticipos.component';
import { OrdenCargaEditFormCombinacionComponent } from '../orden-carga-edit-form-combinacion/orden-carga-edit-form-combinacion.component';
import { OrdenCargaEditFormComplementosComponent } from '../orden-carga-edit-form-complementos/orden-carga-edit-form-complementos.component';
import { OrdenCargaEditFormDescuentosComponent } from '../orden-carga-edit-form-descuentos/orden-carga-edit-form-descuentos.component';
import { OrdenCargaEditFormInfoComponent } from '../orden-carga-edit-form-info/orden-carga-edit-form-info.component';
import { OrdenCargaEditFormRemisionesDestinoComponent } from '../orden-carga-edit-form-remisiones-destino/orden-carga-edit-form-remisiones-destino.component';
import { OrdenCargaEditFormRemisionesOrigenComponent } from '../orden-carga-edit-form-remisiones-origen/orden-carga-edit-form-remisiones-origen.component';
import { OrdenCargaEditFormTramoComponent } from '../orden-carga-edit-form-tramo/orden-carga-edit-form-tramo.component';

import { OrdenCargaEditFormComponent } from './orden-carga-edit-form.component';

describe('OrdenCargaEditFormComponent', () => {
  let component: OrdenCargaEditFormComponent;
  let fixture: ComponentFixture<OrdenCargaEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        OrdenCargaEditFormComponent,
        OrdenCargaEditFormAccionesComponent,
        OrdenCargaEditFormAnticiposComponent,
        OrdenCargaEditFormCombinacionComponent,
        OrdenCargaEditFormComplementosComponent,
        OrdenCargaEditFormDescuentosComponent,
        OrdenCargaEditFormInfoComponent,
        OrdenCargaEditFormRemisionesDestinoComponent,
        OrdenCargaEditFormRemisionesOrigenComponent,
        OrdenCargaEditFormTramoComponent,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
