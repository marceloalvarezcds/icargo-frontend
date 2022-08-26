import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoPersonaList } from 'src/app/interfaces/tipo-persona';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { UserService } from 'src/app/services/user.service';
import { findElement } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { PropietarioFormInfoComponent } from './propietario-form-info.component';

describe('PropietarioFormInfoComponent', () => {
  let component: PropietarioFormInfoComponent;
  let fixture: ComponentFixture<PropietarioFormInfoComponent>;
  let httpController: HttpTestingController;
  let tipoPersonaField: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        DirectivesModule,
        FormFieldModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthService,
        PaisService,
        PermisoPipe,
        TipoPersonaService,
        UserService,
      ],
      declarations: [PropietarioFormInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tipoPersonaField = findElement(fixture, 'app-tipo-persona-field');
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController
      .expectOne(`${environment.api}/tipo_persona/`)
      .flush(mockTipoPersonaList);
    httpController
      .expectOne(`${environment.api}/user/gestor_carga_id`)
      .flush([mockUser]);
    flush();
    tipoPersonaField.triggerEventHandler('isFisicaSelected', true);
    tick();
    tipoPersonaField.triggerEventHandler('isFisicaSelected', false);
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
