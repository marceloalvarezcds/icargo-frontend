import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './autofocus.directive';
import { InputThousandsSeparatorDirective } from './input-thousands-separator.directive';

const directives = [
  AutofocusDirective,
  InputThousandsSeparatorDirective,
];

@NgModule({
  declarations: directives.slice(),
  exports: directives.slice(),
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
