import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ComplementoFormDialogComponent } from './complemento-form-dialog/complemento-form-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from './contacto-form-dialog/contacto-form-dialog.component';
import { DescuentoFormDialogComponent } from './descuento-form-dialog/descuento-form-dialog.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';

const modules = [
  ComplementoFormDialogComponent,
  ConfirmationDialogComponent,
  ContactoFormDialogComponent,
  DescuentoFormDialogComponent,
  LoadingDialogComponent,
];

@NgModule({
  declarations: modules.slice(),
  entryComponents: modules.slice(),
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    FormFieldModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DialogsModule { }
