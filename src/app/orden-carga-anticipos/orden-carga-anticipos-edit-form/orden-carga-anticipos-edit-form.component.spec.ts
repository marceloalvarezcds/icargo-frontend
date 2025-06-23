import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAnticiposEditFormComponent } from './orden-carga-anticipos-edit-form.component';

describe('OrdenCargaAnticiposEditFormComponent', () => {
  let component: OrdenCargaAnticiposEditFormComponent;
  let fixture: ComponentFixture<OrdenCargaAnticiposEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAnticiposEditFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAnticiposEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
