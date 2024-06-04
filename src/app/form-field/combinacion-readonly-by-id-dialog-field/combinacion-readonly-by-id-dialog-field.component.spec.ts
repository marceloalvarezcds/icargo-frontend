import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinacionReadonlyByIdDialogFieldComponent } from './combinacion-readonly-by-id-dialog-field.component';

describe('CombinacionReadonlyByIdDialogFieldComponent', () => {
  let component: CombinacionReadonlyByIdDialogFieldComponent;
  let fixture: ComponentFixture<CombinacionReadonlyByIdDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinacionReadonlyByIdDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinacionReadonlyByIdDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
