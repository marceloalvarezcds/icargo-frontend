import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaFinalizarFormComponent } from './orden-carga-finalizar-form.component';

describe('OrdenCargaFinalizarFormComponent', () => {
  let component: OrdenCargaFinalizarFormComponent;
  let fixture: ComponentFixture<OrdenCargaFinalizarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaFinalizarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaFinalizarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
