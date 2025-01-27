import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcFinalizadasDialogFieldComponent } from './oc-finalizadas-dialog-field.component';

describe('OcFinalizadasDialogFieldComponent', () => {
  let component: OcFinalizadasDialogFieldComponent;
  let fixture: ComponentFixture<OcFinalizadasDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcFinalizadasDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcFinalizadasDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
