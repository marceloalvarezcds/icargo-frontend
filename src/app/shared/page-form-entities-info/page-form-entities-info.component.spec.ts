import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockComposicionJuridicaList } from 'src/app/interfaces/composicion-juridica';
import { mockTipoDocumentoList } from 'src/app/interfaces/tipo-documento';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { fakeFileList } from 'src/app/utils/test';
import { environment } from 'src/environments/environment';

import { PageFormEntitiesInfoComponent } from './page-form-entities-info.component';

describe('PageFormEntitiesInfoComponent', () => {
  let component: PageFormEntitiesInfoComponent;
  let fixture: ComponentFixture<PageFormEntitiesInfoComponent>;
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
        UserService,
        ComposicionJuridicaService,
        TipoDocumentoService,
      ],
      declarations: [ PageFormEntitiesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PageFormEntitiesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/composicion_juridica/`).flush(mockComposicionJuridicaList);
    httpController.expectOne(`${environment.api}/tipo_documento/`).flush(mockTipoDocumentoList);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));

  it('should call to fileChange', fakeAsync(() => {
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.files = fakeFileList;
    fileInput.dispatchEvent(new Event('change'));
    tick();
    expect(fileChangeSpy).toHaveBeenCalled();
  }));

  it('should call to fileChange with empty files', fakeAsync(() => {
    const fileChangeSpy = spyOn(component, 'fileChange').and.callThrough();
    const fileInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('#file-input');
    fileInput.dispatchEvent(new Event('change'));
    tick();
    expect(fileChangeSpy).toHaveBeenCalled();
  }));
});
