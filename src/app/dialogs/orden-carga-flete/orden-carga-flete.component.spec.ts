import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCargaFleteComponent } from './orden-carga-flete.component';

describe('OrdenCargaFleteComponent', () => {
  let component: OrdenCargaFleteComponent;
  let fixture: ComponentFixture<OrdenCargaFleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenCargaFleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCargaFleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
