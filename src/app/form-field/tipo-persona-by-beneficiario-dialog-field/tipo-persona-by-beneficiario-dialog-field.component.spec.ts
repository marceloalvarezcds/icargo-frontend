import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPersonaByBeneficiarioDialogFieldComponent } from './tipo-persona-by-beneficiario-dialog-field.component';

describe('TipoPersonaByBeneficiarioDialogFieldComponent', () => {
  let component: TipoPersonaByBeneficiarioDialogFieldComponent;
  let fixture: ComponentFixture<TipoPersonaByBeneficiarioDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPersonaByBeneficiarioDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPersonaByBeneficiarioDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
