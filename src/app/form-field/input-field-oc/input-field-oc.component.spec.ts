import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldOcComponent } from './input-field-oc.component';

describe('InputFieldOcComponent', () => {
  let component: InputFieldOcComponent;
  let fixture: ComponentFixture<InputFieldOcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldOcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
