import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPersonaByPropietarioFieldComponent } from './tipo-persona-by-propietario-field.component';

describe('TipoPersonaByPropietarioFieldComponent', () => {
  let component: TipoPersonaByPropietarioFieldComponent;
  let fixture: ComponentFixture<TipoPersonaByPropietarioFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPersonaByPropietarioFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPersonaByPropietarioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
