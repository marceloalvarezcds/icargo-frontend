import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoLegalDialogFieldComponent } from './texto-legal-dialog-field.component';

describe('TextoLegalDialogFieldComponent', () => {
  let component: TextoLegalDialogFieldComponent;
  let fixture: ComponentFixture<TextoLegalDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoLegalDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextoLegalDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
