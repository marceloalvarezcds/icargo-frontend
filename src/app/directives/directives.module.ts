import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './autofocus.directive';

const directives = [
  AutofocusDirective,
];

@NgModule({
  declarations: directives.slice(),
  exports: directives.slice(),
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
