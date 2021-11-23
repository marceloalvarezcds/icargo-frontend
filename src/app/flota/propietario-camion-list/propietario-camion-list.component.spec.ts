import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockCamionList } from 'src/app/interfaces/camion';
import { MaterialModule } from 'src/app/material/material.module';
import { CamionService } from 'src/app/services/camion.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { PropietarioCamionListComponent } from './propietario-camion-list.component';

describe('PropietarioCamionListComponent', () => {
  let component: PropietarioCamionListComponent;
  let fixture: ComponentFixture<PropietarioCamionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ CamionService ],
      declarations: [ PropietarioCamionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropietarioCamionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.columns.forEach(c => c.value && c.value(mockCamionList[0]));
    component.propietarioId = undefined;
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId', () => {
    component.propietarioId = 1;
    expect(component.list).toBe(mockCamionList);
  });
});
