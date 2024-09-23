import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPreviewConciliarDialogComponent } from './pdf-preview-conciliar-dialog.component';

describe('PdfPreviewConciliarDialogComponent', () => {
  let component: PdfPreviewConciliarDialogComponent;
  let fixture: ComponentFixture<PdfPreviewConciliarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfPreviewConciliarDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPreviewConciliarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
