import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaPdvComponent } from './estado-cuenta-pdv.component';

describe('EstadoCuentaPdvComponent', () => {
  let component: EstadoCuentaPdvComponent;
  let fixture: ComponentFixture<EstadoCuentaPdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaPdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaPdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
