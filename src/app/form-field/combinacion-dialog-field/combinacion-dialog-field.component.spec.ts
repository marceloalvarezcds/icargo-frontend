import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinacionDialogFieldComponent } from './combinacion-dialog-field.component';

describe('CombinacionDialogFieldComponent', () => {
  let component: CombinacionDialogFieldComponent;
  let fixture: ComponentFixture<CombinacionDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinacionDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinacionDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
