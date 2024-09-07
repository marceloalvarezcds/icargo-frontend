import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaConciliarFormComponent } from './orden-carga-conciliar-form.component';

describe('OrdenCargaConciliarFormComponent', () => {
  let component: OrdenCargaConciliarFormComponent;
  let fixture: ComponentFixture<OrdenCargaConciliarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaConciliarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaConciliarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
