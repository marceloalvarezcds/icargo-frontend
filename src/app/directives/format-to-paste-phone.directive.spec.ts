import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormatToPastePhoneDirective } from './format-to-paste-phone.directive';

describe('FormatToPastePhoneDirective', () => {
  @Component({
    template: '<input [formControl]="control" appFormatToPastePhone />',
  })
  class TestComponent {
    control = new FormControl('');
  }

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [TestComponent, FormatToPastePhoneDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', fakeAsync(() => {
    const directive = fixture.debugElement.query(
      By.directive(FormatToPastePhoneDirective)
    );
    tick(1500);
    expect(directive).toBeTruthy();
  }));
});
