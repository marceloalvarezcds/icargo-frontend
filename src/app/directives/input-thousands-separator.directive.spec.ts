/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { errorMessage } from 'src/app/utils/thousands-separator';
import { InputThousandsSeparatorDirective, forwardFunc } from './input-thousands-separator.directive';

@Component({
  template: `
    <input #directive="appInputThousandsSeparator" appInputThousandsSeparator [value]="1000">
  `
})
class TestComponent {
  @ViewChild(InputThousandsSeparatorDirective) directive?: InputThousandsSeparatorDirective;
  // @ViewChild('directive') directive2?: InputThousandsSeparatorDirective;
}

describe('InputThousandsSeparatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    forwardFunc()
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        TestComponent,
        InputThousandsSeparatorDirective,
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component.directive).toBeTruthy();
  });

  it('should trigger keydown event', () => {
    const event = new KeyboardEvent('keydown', { 'key': 'Enter' });
    const directive = component.directive!;
    const el: HTMLInputElement = (directive as any).elementRef.nativeElement;
    el.dispatchEvent(event);
    expect(directive.value).toBeTruthy();
  });

  it('should trigger input event with value 1.200,01', () => {
    const event = new Event('input', { target: { value: '1.200,01' } } as any);
    fixture.detectChanges();
    const directive = component.directive!;
    const el: HTMLInputElement = (directive as any).elementRef.nativeElement;
    el.value = '1.200,01';
    el.dispatchEvent(event);
    expect(directive).toBeTruthy();
  });

  it('should trigger input event with value 100,', () => {
    const event = new Event('input', { target: { value: '100,' } } as any);
    fixture.detectChanges();
    const directive = component.directive!
    const el: HTMLInputElement = (directive as any).elementRef.nativeElement;
    el.value = '100,';
    el.dispatchEvent(event);
    expect(directive).toBeTruthy();
  });

  it('should generate error', () => {
    expect(() => new InputThousandsSeparatorDirective(({ nativeElement: { type: 'number' }}) as any)).toThrowError(errorMessage);
  });
});
