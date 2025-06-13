import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAnticiposFormComponent } from './orden-carga-anticipos-form.component';

describe('OrdenCargaAnticiposFormComponent', () => {
  let component: OrdenCargaAnticiposFormComponent;
  let fixture: ComponentFixture<OrdenCargaAnticiposFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAnticiposFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAnticiposFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
