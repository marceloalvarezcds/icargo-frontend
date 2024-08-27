import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaFormAceptarComponent } from './orden-carga-form-aceptar.component';

describe('OrdenCargaFormAceptarComponent', () => {
  let component: OrdenCargaFormAceptarComponent;
  let fixture: ComponentFixture<OrdenCargaFormAceptarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaFormAceptarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaFormAceptarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
