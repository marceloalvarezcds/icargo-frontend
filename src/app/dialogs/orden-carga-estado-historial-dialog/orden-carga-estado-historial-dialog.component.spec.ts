import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaEstadoHistorialDialogComponent } from './orden-carga-estado-historial-dialog.component';

describe('OrdenCargaEstadoHistorialDialogComponent', () => {
  let component: OrdenCargaEstadoHistorialDialogComponent;
  let fixture: ComponentFixture<OrdenCargaEstadoHistorialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaEstadoHistorialDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaEstadoHistorialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
