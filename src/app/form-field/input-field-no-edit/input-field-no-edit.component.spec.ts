import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldNoEditComponent } from './input-field-no-edit.component';

describe('InputFieldNoEditComponent', () => {
  let component: InputFieldNoEditComponent;
  let fixture: ComponentFixture<InputFieldNoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldNoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldNoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
