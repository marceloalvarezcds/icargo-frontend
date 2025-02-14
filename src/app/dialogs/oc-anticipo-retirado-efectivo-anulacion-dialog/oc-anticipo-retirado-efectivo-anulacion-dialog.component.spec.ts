import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnticipoRetiradoEfectivoAnulacionDialogComponent } from './oc-anticipo-retirado-efectivo-anulacion-dialog.component';

describe('OcAnticipoRetiradoEfectivoAnulacionDialogComponent', () => {
  let component: OcAnticipoRetiradoEfectivoAnulacionDialogComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoEfectivoAnulacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAnticipoRetiradoEfectivoAnulacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoEfectivoAnulacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
