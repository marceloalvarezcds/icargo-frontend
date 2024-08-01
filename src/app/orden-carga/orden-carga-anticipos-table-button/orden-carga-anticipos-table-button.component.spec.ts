import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAnticiposTableButtonComponent } from './orden-carga-anticipos-table-button.component';

describe('OrdenCargaAnticiposTableButtonComponent', () => {
  let component: OrdenCargaAnticiposTableButtonComponent;
  let fixture: ComponentFixture<OrdenCargaAnticiposTableButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAnticiposTableButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAnticiposTableButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
