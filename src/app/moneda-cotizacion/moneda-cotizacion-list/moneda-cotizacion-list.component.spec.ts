import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaCotizacionListComponent } from './moneda-cotizacion-list.component';

describe('MonedaCotizacionListComponent', () => {
  let component: MonedaCotizacionListComponent;
  let fixture: ComponentFixture<MonedaCotizacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonedaCotizacionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaCotizacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
