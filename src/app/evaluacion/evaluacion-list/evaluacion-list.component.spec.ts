import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionListComponent } from './evaluacion-list.component';

describe('EvaluacionListComponent', () => {
  let component: EvaluacionListComponent;
  let fixture: ComponentFixture<EvaluacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
