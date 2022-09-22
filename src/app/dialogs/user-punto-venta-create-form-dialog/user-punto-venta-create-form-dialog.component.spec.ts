import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPuntoVentaCreateFormDialogComponent } from './user-punto-venta-create-form-dialog.component';

describe('UserPuntoVentaCreateFormDialogComponent', () => {
  let component: UserPuntoVentaCreateFormDialogComponent;
  let fixture: ComponentFixture<UserPuntoVentaCreateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPuntoVentaCreateFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPuntoVentaCreateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
