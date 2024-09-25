import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEvaluacionFieldComponent } from './tipo-evaluacion-field.component';

describe('TipoEvaluacionFieldComponent', () => {
  let component: TipoEvaluacionFieldComponent;
  let fixture: ComponentFixture<TipoEvaluacionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoEvaluacionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEvaluacionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
