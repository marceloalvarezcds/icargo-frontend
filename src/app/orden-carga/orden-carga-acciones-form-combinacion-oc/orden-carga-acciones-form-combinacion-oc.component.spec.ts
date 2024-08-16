import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAccionesFormCombinacionOcComponent } from './orden-carga-acciones-form-combinacion-oc.component';

describe('OrdenCargaAccionesFormCombinacionOcComponent', () => {
  let component: OrdenCargaAccionesFormCombinacionOcComponent;
  let fixture: ComponentFixture<OrdenCargaAccionesFormCombinacionOcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAccionesFormCombinacionOcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAccionesFormCombinacionOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
