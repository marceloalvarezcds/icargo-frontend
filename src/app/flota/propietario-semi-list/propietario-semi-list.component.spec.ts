import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockSemirremolqueList } from 'src/app/interfaces/semirremolque';
import { MaterialModule } from 'src/app/material/material.module';
import { SemirremolqueService } from 'src/app/services/semirremolque.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { PropietarioSemiListComponent } from './propietario-semi-list.component';

describe('PropietarioSemiListComponent', () => {
  let component: PropietarioSemiListComponent;
  let fixture: ComponentFixture<PropietarioSemiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        SharedModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ SemirremolqueService ],
      declarations: [ PropietarioSemiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropietarioSemiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.columns.forEach(c => c.value && c.value(mockSemirremolqueList[0]));
    component.propietarioId = undefined;
    expect(component).toBeTruthy();
  });

  it('should create with propietarioId', () => {
    component.propietarioId = 1;
    expect(component.list).toBe(mockSemirremolqueList);
  });
});
