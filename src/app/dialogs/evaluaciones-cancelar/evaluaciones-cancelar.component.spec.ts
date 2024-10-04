import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesCancelarComponent } from './evaluaciones-cancelar.component';

describe('EvaluacionesCancelarComponent', () => {
  let component: EvaluacionesCancelarComponent;
  let fixture: ComponentFixture<EvaluacionesCancelarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionesCancelarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionesCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
