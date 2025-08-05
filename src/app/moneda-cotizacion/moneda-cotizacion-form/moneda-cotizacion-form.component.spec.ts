import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaCotizacionFormComponent } from './moneda-cotizacion-form.component';

describe('MonedaCotizacionFormComponent', () => {
  let component: MonedaCotizacionFormComponent;
  let fixture: ComponentFixture<MonedaCotizacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonedaCotizacionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaCotizacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
