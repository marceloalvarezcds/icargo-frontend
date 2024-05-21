import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropietarioByTipoPersonaMapDialogFieldComponent } from './propietario-by-tipo-persona-map-dialog-field.component';

describe('PropietarioByTipoPersonaMapDialogFieldComponent', () => {
  let component: PropietarioByTipoPersonaMapDialogFieldComponent;
  let fixture: ComponentFixture<PropietarioByTipoPersonaMapDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropietarioByTipoPersonaMapDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropietarioByTipoPersonaMapDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
