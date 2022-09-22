import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPuntoVentaEditFormDialogComponent } from './user-punto-venta-edit-form-dialog.component';

describe('UserPuntoVentaEditFormDialogComponent', () => {
  let component: UserPuntoVentaEditFormDialogComponent;
  let fixture: ComponentFixture<UserPuntoVentaEditFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPuntoVentaEditFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPuntoVentaEditFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
