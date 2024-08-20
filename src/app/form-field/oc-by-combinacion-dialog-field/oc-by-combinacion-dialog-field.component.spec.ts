import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcByCombinacionDialogFieldComponent } from './oc-by-combinacion-dialog-field.component';

describe('OcByCombinacionDialogFieldComponent', () => {
  let component: OcByCombinacionDialogFieldComponent;
  let fixture: ComponentFixture<OcByCombinacionDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcByCombinacionDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcByCombinacionDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
