import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsmunoVentaPrecioFormComponent } from './create-insmuno-venta-precio-form.component';

describe('CreateInsmunoVentaPrecioFormComponent', () => {
  let component: CreateInsmunoVentaPrecioFormComponent;
  let fixture: ComponentFixture<CreateInsmunoVentaPrecioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsmunoVentaPrecioFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInsmunoVentaPrecioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
