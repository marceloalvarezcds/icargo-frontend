import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcByCombinacionNuevosDialogFieldComponent } from './oc-by-combinacion-nuevos-dialog-field.component';

describe('OcByCombinacionNuevosDialogFieldComponent', () => {
  let component: OcByCombinacionNuevosDialogFieldComponent;
  let fixture: ComponentFixture<OcByCombinacionNuevosDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcByCombinacionNuevosDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcByCombinacionNuevosDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
