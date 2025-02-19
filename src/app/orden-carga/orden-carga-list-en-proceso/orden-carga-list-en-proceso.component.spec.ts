import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaListEnProcesoComponent } from './orden-carga-list-en-proceso.component';

describe('OrdenCargaListEnProcesoComponent', () => {
  let component: OrdenCargaListEnProcesoComponent;
  let fixture: ComponentFixture<OrdenCargaListEnProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaListEnProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaListEnProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
