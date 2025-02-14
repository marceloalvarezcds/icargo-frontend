import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnticipoRetiradoInsumoAnulacionDialogComponent } from './oc-anticipo-retirado-insumo-anulacion-dialog.component';

describe('OcAnticipoRetiradoInsumoAnulacionDialogComponent', () => {
  let component: OcAnticipoRetiradoInsumoAnulacionDialogComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoInsumoAnulacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAnticipoRetiradoInsumoAnulacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoInsumoAnulacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
