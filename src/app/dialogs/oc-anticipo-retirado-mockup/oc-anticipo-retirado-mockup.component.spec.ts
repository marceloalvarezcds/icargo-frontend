import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnticipoRetiradoMockupComponent } from './oc-anticipo-retirado-mockup.component';

describe('OcAnticipoRetiradoMockupComponent', () => {
  let component: OcAnticipoRetiradoMockupComponent;
  let fixture: ComponentFixture<OcAnticipoRetiradoMockupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcAnticipoRetiradoMockupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcAnticipoRetiradoMockupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
