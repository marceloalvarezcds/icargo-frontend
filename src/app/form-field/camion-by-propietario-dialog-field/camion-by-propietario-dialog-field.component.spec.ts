import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamionByPropietarioDialogFieldComponent } from './camion-by-propietario-dialog-field.component';

describe('CamionByPropietarioDialogFieldComponent', () => {
  let component: CamionByPropietarioDialogFieldComponent;
  let fixture: ComponentFixture<CamionByPropietarioDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamionByPropietarioDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionByPropietarioDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
