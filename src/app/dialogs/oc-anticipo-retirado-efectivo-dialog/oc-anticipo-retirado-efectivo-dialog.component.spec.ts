import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnticipoRetiradoEfectivoDialogComponent } from './oc-anticipo-retirado-efectivo-dialog.component';

describe('OcAnticipoRetiradoEfectivoDialogComponent', () => {
  let component: OcAnticipoRetiradoEfectivoDialogComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoEfectivoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAnticipoRetiradoEfectivoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoEfectivoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
