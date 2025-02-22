import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoLegalFormDialogComponent } from './texto-legal-form-dialog.component';

describe('TextoLegalFormDialogComponent', () => {
  let component: TextoLegalFormDialogComponent;
  let fixture: ComponentFixture<TextoLegalFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextoLegalFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextoLegalFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
