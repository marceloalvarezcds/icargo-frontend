import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldNetoComponent } from './input-field-neto.component';

describe('InputFieldNetoComponent', () => {
  let component: InputFieldNetoComponent;
  let fixture: ComponentFixture<InputFieldNetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldNetoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldNetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
