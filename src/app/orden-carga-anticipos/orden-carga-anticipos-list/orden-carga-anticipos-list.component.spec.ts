import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaAnticiposListComponent } from './orden-carga-anticipos-list.component';

describe('OrdenCargaAnticiposListComponent', () => {
  let component: OrdenCargaAnticiposListComponent;
  let fixture: ComponentFixture<OrdenCargaAnticiposListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaAnticiposListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaAnticiposListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
