import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockSemiList } from 'src/app/interfaces/semi';
import { MaterialModule } from 'src/app/material/material.module';
import { SemiService } from 'src/app/services/semi.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

import { PropietarioSemiListComponent } from './propietario-semi-list.component';

describe('PropietarioSemiListComponent', () => {
  let component: PropietarioSemiListComponent;
  let fixture: ComponentFixture<PropietarioSemiListComponent>;
  let httpController: HttpTestingController;
  const propietarioId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ SemiService ],
      declarations: [ PropietarioSemiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PropietarioSemiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.columns.forEach(c => c.value && c.value(mockSemiList[0]));
    component.propietarioId = undefined;
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId', fakeAsync(() => {
    component.propietarioId = 1;
    httpController.expectOne(`${environment.api}/semi/propietario/${propietarioId}/`).flush(mockSemiList);
    flush();
    expect(component.list).toBe(mockSemiList);
  }));
});
