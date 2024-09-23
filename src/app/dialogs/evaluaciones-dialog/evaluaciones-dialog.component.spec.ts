import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesDialogComponent } from './evaluaciones-dialog.component';

describe('EvaluacionesDialogComponent', () => {
  let component: EvaluacionesDialogComponent;
  let fixture: ComponentFixture<EvaluacionesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
