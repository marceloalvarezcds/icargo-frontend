import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from './contacto-form-dialog/contacto-form-dialog.component';
import { DirectivesModule } from '../directives/directives.module';

const modules = [
  LoadingDialogComponent,
  ConfirmationDialogComponent,
  ContactoFormDialogComponent,
];

@NgModule({
  declarations: modules.slice(),
  entryComponents: modules.slice(),
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DialogsModule { }
