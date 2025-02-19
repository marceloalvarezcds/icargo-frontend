import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaListCerradasComponent } from './orden-carga-list-cerradas.component';

describe('OrdenCargaListCerradasComponent', () => {
  let component: OrdenCargaListCerradasComponent;
  let fixture: ComponentFixture<OrdenCargaListCerradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaListCerradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaListCerradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
