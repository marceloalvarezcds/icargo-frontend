import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaCreateFormRecepcionComponent } from './orden-carga-create-form-recepcion.component';

describe('OrdenCargaCreateFormRecepcionComponent', () => {
  let component: OrdenCargaCreateFormRecepcionComponent;
  let fixture: ComponentFixture<OrdenCargaCreateFormRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaCreateFormRecepcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaCreateFormRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
