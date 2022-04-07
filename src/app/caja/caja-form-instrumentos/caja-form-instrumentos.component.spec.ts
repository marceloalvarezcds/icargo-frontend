import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CajaModule } from '../caja.module';

import { CajaFormInstrumentosComponent } from './caja-form-instrumentos.component';

describe('CajaFormInstrumentosComponent', () => {
  let component: CajaFormInstrumentosComponent;
  let fixture: ComponentFixture<CajaFormInstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, CajaModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CajaFormInstrumentosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaFormInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
