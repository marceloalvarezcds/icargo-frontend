import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { LiquidacionFormMovimientosComponent } from './liquidacion-form-movimientos.component';

describe('LiquidacionFormMovimientosComponent', () => {
  let component: LiquidacionFormMovimientosComponent;
  let fixture: ComponentFixture<LiquidacionFormMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionFormMovimientosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionFormMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
