import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionFormComponent } from './evaluacion-form.component';

describe('EvaluacionFormComponent', () => {
  let component: EvaluacionFormComponent;
  let fixture: ComponentFixture<EvaluacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
