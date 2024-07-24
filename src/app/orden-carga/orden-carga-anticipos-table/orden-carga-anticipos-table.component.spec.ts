import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAnticiposTableComponent } from './orden-carga-anticipos-table.component';

describe('OrdenCargaAnticiposTableComponent', () => {
  let component: OrdenCargaAnticiposTableComponent;
  let fixture: ComponentFixture<OrdenCargaAnticiposTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAnticiposTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAnticiposTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
