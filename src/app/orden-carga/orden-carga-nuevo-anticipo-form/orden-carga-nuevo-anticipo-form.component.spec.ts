import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaNuevoAnticipoFormComponent } from './orden-carga-nuevo-anticipo-form.component';

describe('OrdenCargaNuevoAnticipoFormComponent', () => {
  let component: OrdenCargaNuevoAnticipoFormComponent;
  let fixture: ComponentFixture<OrdenCargaNuevoAnticipoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaNuevoAnticipoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaNuevoAnticipoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
