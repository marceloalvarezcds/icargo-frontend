import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlotaModule } from '../flota.module';
import { CamionFormCombinacionComponent } from './camion-form-combinacion.component';

describe('CamionFormCombinacionComponent', () => {
  let component: CamionFormCombinacionComponent;
  let fixture: ComponentFixture<CamionFormCombinacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, FlotaModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CamionFormCombinacionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionFormCombinacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
