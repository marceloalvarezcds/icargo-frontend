import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaReportsComponent } from './orden-carga-reports.component';

describe('OrdenCargaReportsComponent', () => {
  let component: OrdenCargaReportsComponent;
  let fixture: ComponentFixture<OrdenCargaReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
