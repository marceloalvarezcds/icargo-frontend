import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnticipoRetiradoInsumoDialogComponent } from './oc-anticipo-retirado-insumo-dialog.component';

describe('OcAnticipoRetiradoInsumoDialogComponent', () => {
  let component: OcAnticipoRetiradoInsumoDialogComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoInsumoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAnticipoRetiradoInsumoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoInsumoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
