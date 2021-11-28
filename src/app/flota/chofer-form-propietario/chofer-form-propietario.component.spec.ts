import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPaisList } from 'src/app/interfaces/pais';
import { MaterialModule } from 'src/app/material/material.module';
import { PaisService } from 'src/app/services/pais.service';
import { environment } from 'src/environments/environment';
import { FlotaModule } from 'src/app/flota/flota.module';

import { ChoferFormPropietarioComponent } from './chofer-form-propietario.component';

describe('ChoferFormPropietarioComponent', () => {
  let component: ChoferFormPropietarioComponent;
  let fixture: ComponentFixture<ChoferFormPropietarioComponent>;
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
      providers: [ PaisService ],
      declarations: [ ChoferFormPropietarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChoferFormPropietarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    httpController.expectOne(`${environment.api}/pais/`).flush(mockPaisList);
    flush();
    expect(component).toBeTruthy();
    httpController.verify();
  }));
});
