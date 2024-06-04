import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldByPlacaComponent } from './input-field-by-placa.component';

describe('InputFieldByPlacaComponent', () => {
  let component: InputFieldByPlacaComponent;
  let fixture: ComponentFixture<InputFieldByPlacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldByPlacaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldByPlacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
