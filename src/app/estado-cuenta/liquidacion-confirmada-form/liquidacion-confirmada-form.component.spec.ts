import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';
import { LiquidacionConfirmadaFormComponent } from './liquidacion-confirmada-form.component';

describe('LiquidacionConfirmadaFormComponent', () => {
  let component: LiquidacionConfirmadaFormComponent;
  let fixture: ComponentFixture<LiquidacionConfirmadaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        EstadoCuentaModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionConfirmadaFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionConfirmadaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
