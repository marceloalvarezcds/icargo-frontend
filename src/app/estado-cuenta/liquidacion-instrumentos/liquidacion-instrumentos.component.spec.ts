import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { LiquidacionInstrumentosComponent } from './liquidacion-instrumentos.component';

describe('LiquidacionInstrumentosComponent', () => {
  let component: LiquidacionInstrumentosComponent;
  let fixture: ComponentFixture<LiquidacionInstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionInstrumentosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
