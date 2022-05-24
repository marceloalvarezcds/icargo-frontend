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
import { FormatToPasteNumberDirective } from './format-to-paste-number.directive';

describe('FormatToPasteNumberDirective', () => {
  @Component({
    template: '<input [formControl]="control" appFormatToPasteNumber />',
  })
  class TestComponent {
    control = new FormControl('');
  }

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [TestComponent, FormatToPasteNumberDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', fakeAsync(() => {
    const directive = fixture.debugElement.query(
      By.directive(FormatToPasteNumberDirective)
    );
    tick(1500);
    expect(directive).toBeTruthy();
  }));
});
