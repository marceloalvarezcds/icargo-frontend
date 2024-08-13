import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaGestionAnticiposComponent } from './orden-carga-gestion-anticipos.component';

describe('OrdenCargaGestionAnticiposComponent', () => {
  let component: OrdenCargaGestionAnticiposComponent;
  let fixture: ComponentFixture<OrdenCargaGestionAnticiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaGestionAnticiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaGestionAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
