import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoEditByMermaFormDialogComponent } from './movimiento-edit-by-merma-form-dialog.component';

describe('MovimientoEditByMermaFormDialogComponent', () => {
  let component: MovimientoEditByMermaFormDialogComponent;
  let fixture: ComponentFixture<MovimientoEditByMermaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientoEditByMermaFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoEditByMermaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
