import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcGestionLineaComponent } from './oc-gestion-linea.component';

describe('OcGestionLineaComponent', () => {
  let component: OcGestionLineaComponent;
  let fixture: ComponentFixture<OcGestionLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcGestionLineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcGestionLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
