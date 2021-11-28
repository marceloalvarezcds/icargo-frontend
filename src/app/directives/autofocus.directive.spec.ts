import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from './autofocus.directive';

@Component({ template: '<input appAutofocus />' })
export class TestComponent { }

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ TestComponent, AutofocusDirective ],
      schemas:      [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', fakeAsync(() => {
    const directive = fixture.debugElement.query(By.directive(AutofocusDirective));
    tick(1500);
    expect(directive).toBeTruthy();
  }));
});
