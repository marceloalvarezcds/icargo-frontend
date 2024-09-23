import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcByCombinacionAceptadosDialogFieldComponent } from './oc-by-combinacion-aceptados-dialog-field.component';

describe('OcByCombinacionAceptadosDialogFieldComponent', () => {
  let component: OcByCombinacionAceptadosDialogFieldComponent;
  let fixture: ComponentFixture<OcByCombinacionAceptadosDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcByCombinacionAceptadosDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcByCombinacionAceptadosDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
