import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaFormUsersComponent } from './punto-venta-form-users.component';

describe('PuntoVentaFormUsersComponent', () => {
  let component: PuntoVentaFormUsersComponent;
  let fixture: ComponentFixture<PuntoVentaFormUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaFormUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaFormUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
