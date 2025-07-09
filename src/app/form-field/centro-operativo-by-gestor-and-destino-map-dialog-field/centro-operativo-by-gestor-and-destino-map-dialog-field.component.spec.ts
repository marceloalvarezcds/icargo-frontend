import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroOperativoByGestorAndDestinoMapDialogFieldComponent } from './centro-operativo-by-gestor-and-destino-map-dialog-field.component';

describe('CentroOperativoByGestorAndDestinoMapDialogFieldComponent', () => {
  let component: CentroOperativoByGestorAndDestinoMapDialogFieldComponent;
  let fixture: ComponentFixture<CentroOperativoByGestorAndDestinoMapDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentroOperativoByGestorAndDestinoMapDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroOperativoByGestorAndDestinoMapDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
