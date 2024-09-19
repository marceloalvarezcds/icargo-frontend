import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionEditFieldsComponent } from './liquidacion-edit-fields.component';

describe('LiquidacionEditFieldsComponent', () => {
  let component: LiquidacionEditFieldsComponent;
  let fixture: ComponentFixture<LiquidacionEditFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionEditFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionEditFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
