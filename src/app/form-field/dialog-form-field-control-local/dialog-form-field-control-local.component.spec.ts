import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormFieldControlLocalComponent } from './dialog-form-field-control-local.component';

describe('DialogFormFieldControlLocalComponent', () => {
  let component: DialogFormFieldControlLocalComponent;
  let fixture: ComponentFixture<DialogFormFieldControlLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFormFieldControlLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormFieldControlLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
