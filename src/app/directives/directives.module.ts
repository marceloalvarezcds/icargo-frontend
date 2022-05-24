import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutofocusDirective } from './autofocus.directive';
import { FormatToPasteNumberDirective } from './format-to-paste-number.directive';
import { FormatToPastePhoneDirective } from './format-to-paste-phone.directive';
import { InputThousandsSeparatorDirective } from './input-thousands-separator.directive';

const directives = [
  AutofocusDirective,
  FormatToPasteNumberDirective,
  FormatToPastePhoneDirective,
  InputThousandsSeparatorDirective,
];

@NgModule({
  declarations: directives.slice(),
  exports: directives.slice(),
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DirectivesModule {}
