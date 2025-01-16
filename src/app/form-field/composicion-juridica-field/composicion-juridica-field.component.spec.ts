import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposicionJuridicaFieldComponent } from './composicion-juridica-field.component';

describe('ComposicionJuridicaFieldComponent', () => {
  let component: ComposicionJuridicaFieldComponent;
  let fixture: ComponentFixture<ComposicionJuridicaFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposicionJuridicaFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposicionJuridicaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
