import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcByCombinacionFinalizadosDialogFieldComponent } from './oc-by-combinacion-finalizados-dialog-field.component';

describe('OcByCombinacionFinalizadosDialogFieldComponent', () => {
  let component: OcByCombinacionFinalizadosDialogFieldComponent;
  let fixture: ComponentFixture<OcByCombinacionFinalizadosDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcByCombinacionFinalizadosDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcByCombinacionFinalizadosDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
