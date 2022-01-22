import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComplementoFormDialogComponent } from './complemento-form-dialog/complemento-form-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from './contacto-form-dialog/contacto-form-dialog.component';
import { DescuentoFormDialogComponent } from './descuento-form-dialog/descuento-form-dialog.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { OcComplementoFormDialogComponent } from './oc-complemento-form-dialog/oc-complemento-form-dialog.component';
import { OcDescuentoFormDialogComponent } from './oc-descuento-form-dialog/oc-descuento-form-dialog.component';
import { OcRemisionDestinoFormDialogComponent } from './oc-remision-destino-form-dialog/oc-remision-destino-form-dialog.component';
import { OcRemisionOrigenFormDialogComponent } from './oc-remision-origen-form-dialog/oc-remision-origen-form-dialog.component';
import { SelectorDialogComponent } from './selector-dialog/selector-dialog.component';

const modules = [
  ComplementoFormDialogComponent,
  ConfirmationDialogComponent,
  ContactoFormDialogComponent,
  DescuentoFormDialogComponent,
  LoadingDialogComponent,
  OcComplementoFormDialogComponent,
  OcDescuentoFormDialogComponent,
  OcRemisionDestinoFormDialogComponent,
  OcRemisionOrigenFormDialogComponent,
  SelectorDialogComponent,
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
    SharedModule,
  ]
})
export class DialogsModule { }
