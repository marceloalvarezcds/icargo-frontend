import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockPaisList } from 'src/app/interfaces/pais';
import { mockTipoPersonaList } from 'src/app/interfaces/tipo-persona';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { UserService } from 'src/app/services/user.service';
import { fakeFileList } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { PropietarioFormInfoComponent } from './propietario-form-info.component';

describe('PropietarioFormInfoComponent', () => {
  let component: PropietarioFormInfoComponent;
  let fixture: ComponentFixture<PropietarioFormInfoComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        AuthService,
        PaisService,
        TipoPersonaService,
        UserService,
      ],
      declarations: [ PropietarioFormInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    httpController.expectOne(`${environment.api}/tipo_persona/`).flush(mockTipoPersonaList);
    httpController.expectOne(`${environment.api}/user/gestor_carga_id/`).flush([mockUser]);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));

  it('should call to fotoDocumentoChange', fakeAsync(() => {
    const fotoDocumentoChangeSpy = spyOn(component, 'fotoDocumentoChange').and.callThrough();
    const fotoPerfilChangeSpy = spyOn(component, 'fotoPerfilChange').and.callThrough();
    const fotoDocumentoInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-documento-input');
    const fotoPerfilInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-perfil-input');
    fotoDocumentoInput.files = fakeFileList;
    fotoPerfilInput.files = fakeFileList;
    fotoDocumentoInput.dispatchEvent(new Event('change'));
    fotoPerfilInput.dispatchEvent(new Event('change'));
    tick();
    expect(fotoDocumentoChangeSpy).toHaveBeenCalled();
    expect(fotoPerfilChangeSpy).toHaveBeenCalled();
  }));

  it('should call to fileChange with empty files', fakeAsync(() => {
    const fotoDocumentoChangeSpy = spyOn(component, 'fotoDocumentoChange').and.callThrough();
    const fotoPerfilChangeSpy = spyOn(component, 'fotoPerfilChange').and.callThrough();
    const fotoDocumentoInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-documento-input');
    const fotoPerfilInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#foto-perfil-input');
    fotoDocumentoInput.dispatchEvent(new Event('change'));
    fotoPerfilInput.dispatchEvent(new Event('change'));
    tick();
    expect(fotoDocumentoChangeSpy).toHaveBeenCalled();
    expect(fotoPerfilChangeSpy).toHaveBeenCalled();
  }));
});
