import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaRecepcionFormComponent } from './orden-carga-recepcion-form.component';

describe('OrdenCargaRecepcionFormComponent', () => {
  let component: OrdenCargaRecepcionFormComponent;
  let fixture: ComponentFixture<OrdenCargaRecepcionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaRecepcionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaRecepcionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
