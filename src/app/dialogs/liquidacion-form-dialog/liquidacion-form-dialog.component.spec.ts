import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionFormDialogComponent } from './liquidacion-form-dialog.component';

describe('LiquidacionFormDialogComponent', () => {
  let component: LiquidacionFormDialogComponent;
  let fixture: ComponentFixture<LiquidacionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
