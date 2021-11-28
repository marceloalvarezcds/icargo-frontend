import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import { ChoferFormInfoComponent } from './chofer-form-info.component';

describe('ChoferFormInfoComponent', () => {
  let component: ChoferFormInfoComponent;
  let fixture: ComponentFixture<ChoferFormInfoComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormFieldModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        AuthService,
        PaisService,
        PermisoPipe,
        TipoDocumentoService,
        UserService,
      ],
      declarations: [ ChoferFormInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
