import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { SearchService } from 'src/app/services/search.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CentrosOperativosListComponent } from './centros-operativos-list.component';

describe('CentrosOperativosListComponent', () => {
  let component: CentrosOperativosListComponent;
  let fixture: ComponentFixture<CentrosOperativosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [ CentroOperativoService, SearchService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CentrosOperativosListComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrosOperativosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
