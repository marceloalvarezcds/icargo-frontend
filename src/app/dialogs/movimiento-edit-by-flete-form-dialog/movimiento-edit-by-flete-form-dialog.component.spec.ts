import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoEditByFleteFormDialogComponent } from './movimiento-edit-by-flete-form-dialog.component';

describe('MovimientoEditByFleteFormDialogComponent', () => {
  let component: MovimientoEditByFleteFormDialogComponent;
  let fixture: ComponentFixture<MovimientoEditByFleteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientoEditByFleteFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoEditByFleteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
