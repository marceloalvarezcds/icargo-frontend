import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoCuentaModule } from 'src/app/estado-cuenta/estado-cuenta.module';
import { LiquidacionComentarioComponent } from './liquidacion-comentario.component';

describe('LiquidacionComentarioComponent', () => {
  let component: LiquidacionComentarioComponent;
  let fixture: ComponentFixture<LiquidacionComentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, EstadoCuentaModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LiquidacionComentarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
