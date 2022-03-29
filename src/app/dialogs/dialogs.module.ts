import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComentarioConfirmDialogComponent } from './comentario-confirm-dialog/comentario-confirm-dialog.component';
import { ComplementoFormDialogComponent } from './complemento-form-dialog/complemento-form-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from './contacto-form-dialog/contacto-form-dialog.component';
import { DescuentoFormDialogComponent } from './descuento-form-dialog/descuento-form-dialog.component';
import { LiquidacionConfirmDialogComponent } from './liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { MovimientosSelectedDialogComponent } from './movimientos-selected-dialog/movimientos-selected-dialog.component';
import { OcAnticipoRetiradoFormDialogComponent } from './oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OcComplementoFormDialogComponent } from './oc-complemento-form-dialog/oc-complemento-form-dialog.component';
import { OcDescuentoFormDialogComponent } from './oc-descuento-form-dialog/oc-descuento-form-dialog.component';
import { OcRemisionDestinoFormDialogComponent } from './oc-remision-destino-form-dialog/oc-remision-destino-form-dialog.component';
import { OcRemisionOrigenFormDialogComponent } from './oc-remision-origen-form-dialog/oc-remision-origen-form-dialog.component';
import { SelectorDialogComponent } from './selector-dialog/selector-dialog.component';

const modules = [
  ComentarioConfirmDialogComponent,
  ComplementoFormDialogComponent,
  ConfirmationDialogComponent,
  ContactoFormDialogComponent,
  DescuentoFormDialogComponent,
  LiquidacionConfirmDialogComponent,
  LoadingDialogComponent,
  MovimientosSelectedDialogComponent,
  OcAnticipoRetiradoFormDialogComponent,
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
    PipesModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class DialogsModule {}
