import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';

import { PuntoVentaFormTransactionalUsersComponent } from './punto-venta-form-transactional-users.component';

describe('PuntoVentaFormTransactionalUsersComponent', () => {
  let component: PuntoVentaFormTransactionalUsersComponent;
  let fixture: ComponentFixture<PuntoVentaFormTransactionalUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PuntoVentaFormTransactionalUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      PuntoVentaFormTransactionalUsersComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
