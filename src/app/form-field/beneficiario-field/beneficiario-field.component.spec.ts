import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioFieldComponent } from './beneficiario-field.component';

describe('BeneficiarioFieldComponent', () => {
  let component: BeneficiarioFieldComponent;
  let fixture: ComponentFixture<BeneficiarioFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiarioFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
