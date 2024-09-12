import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionFormFieldsComponent } from './liquidacion-form-fields.component';

describe('LiquidacionFormFieldsComponent', () => {
  let component: LiquidacionFormFieldsComponent;
  let fixture: ComponentFixture<LiquidacionFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionFormFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
