import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { BancoModule } from '../banco.module';

import { BancoFormInstrumentosComponent } from './banco-form-instrumentos.component';

describe('BancoFormInstrumentosComponent', () => {
  let component: BancoFormInstrumentosComponent;
  let fixture: ComponentFixture<BancoFormInstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        BancoModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BancoFormInstrumentosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoFormInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
