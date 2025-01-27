import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAceptadasDialogFieldComponent } from './oc-aceptadas-dialog-field.component';

describe('OcAceptadasDialogFieldComponent', () => {
  let component: OcAceptadasDialogFieldComponent;
  let fixture: ComponentFixture<OcAceptadasDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAceptadasDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAceptadasDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
