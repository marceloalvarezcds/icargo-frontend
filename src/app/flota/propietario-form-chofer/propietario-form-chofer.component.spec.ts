import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { MaterialModule } from 'src/app/material/material.module';
import { PaisService } from 'src/app/services/pais.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { environment } from 'src/environments/environment';
import { FlotaModule } from '../flota.module';

import { PropietarioFormChoferComponent } from './propietario-form-chofer.component';

describe('PropietarioFormChoferComponent', () => {
  let component: PropietarioFormChoferComponent;
  let fixture: ComponentFixture<PropietarioFormChoferComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FlotaModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        PaisService,
        TipoDocumentoService,
      ],
      declarations: [ PropietarioFormChoferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
