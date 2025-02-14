import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CamionSemiNetoFormDialogComponent } from './camion-semi-neto-form-dialog/camion-semi-neto-form-dialog.component';
import { ComentarioConfirmDialogComponent } from './comentario-confirm-dialog/comentario-confirm-dialog.component';
import { ComplementoFormDialogComponent } from './complemento-form-dialog/complemento-form-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from './contacto-form-dialog/contacto-form-dialog.component';
import { DescuentoFormDialogComponent } from './descuento-form-dialog/descuento-form-dialog.component';
import { FacturaFormDialogComponent } from './factura-form-dialog/factura-form-dialog.component';
import { FleteConfirmationDialogComponent } from './flete-confirmation-dialog/flete-confirmation-dialog.component';
import { InstrumentoFormDialogComponent } from './instrumento-form-dialog/instrumento-form-dialog.component';
import { LiquidacionConfirmDialogComponent } from './liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { MovimientoEditByFleteFormDialogComponent } from './movimiento-edit-by-flete-form-dialog/movimiento-edit-by-flete-form-dialog.component';
import { MovimientoEditByMermaFormDialogComponent } from './movimiento-edit-by-merma-form-dialog/movimiento-edit-by-merma-form-dialog.component';
import { MovimientoFormDialogComponent } from './movimiento-form-dialog/movimiento-form-dialog.component';
import { MovimientosSelectedDialogComponent } from './movimientos-selected-dialog/movimientos-selected-dialog.component';
import { OcAnticipoRetiradoFormDialogComponent } from './oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OcComplementoFormDialogComponent } from './oc-complemento-form-dialog/oc-complemento-form-dialog.component';
import { OcConfirmationDialogComponent } from './oc-confirmation-dialog/oc-confirmation-dialog.component';
import { OcDescuentoFormDialogComponent } from './oc-descuento-form-dialog/oc-descuento-form-dialog.component';
import { OcRemisionDestinoFormDialogComponent } from './oc-remision-destino-form-dialog/oc-remision-destino-form-dialog.component';
import { OcRemisionOrigenFormDialogComponent } from './oc-remision-origen-form-dialog/oc-remision-origen-form-dialog.component';
import { SeleccionableFormDialogComponent } from './seleccionable-form-dialog/seleccionable-form-dialog.component';
import { SelectorDialogComponent } from './selector-dialog/selector-dialog.component';
import { SelectorInMapDialogComponent } from './selector-in-map-dialog/selector-in-map-dialog.component';
import { TipoCuentaFormDialogComponent } from './tipo-cuenta-form-dialog/tipo-cuenta-form-dialog.component';
import { TipoMovimientoFormDialogComponent } from './tipo-movimiento-form-dialog/tipo-movimiento-form-dialog.component';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { OcAnticipoRetiradoMockupComponent } from './oc-anticipo-retirado-mockup/oc-anticipo-retirado-mockup.component';
import { OcGestionLineaComponent } from './oc-gestion-linea/oc-gestion-linea.component';
import { OrdenCargaGestionAnticiposComponent } from './orden-carga-gestion-anticipos/orden-carga-gestion-anticipos.component';
import { OrdenCargaFleteComponent } from './orden-carga-flete/orden-carga-flete.component';
import { LiquidacionFormDialogComponent } from './liquidacion-form-dialog/liquidacion-form-dialog.component';
import { EstadoCuentaModule } from '../estado-cuenta/estado-cuenta.module';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { OrdenCargaEstadoHistorialDialogComponent } from './orden-carga-estado-historial-dialog/orden-carga-estado-historial-dialog.component';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { EvaluacionesDialogComponent } from './evaluaciones-dialog/evaluaciones-dialog.component';
import { EvaluacionesCancelarComponent } from './evaluaciones-cancelar/evaluaciones-cancelar.component';
import { RemisionFormDialogComponent } from './remision-form-dialog/remision-form-dialog.component';
import { OcRemitirDialogComponent } from './oc-remitir-dialog/oc-remitir-dialog.component';
import { OcAnticipoRetiradoEfectivoDialogComponent } from './oc-anticipo-retirado-efectivo-dialog/oc-anticipo-retirado-efectivo-dialog.component';
import { OcAnticipoRetiradoInsumoDialogComponent } from './oc-anticipo-retirado-insumo-dialog/oc-anticipo-retirado-insumo-dialog.component';
import { OcAnticipoRetiradoEfectivoAnulacionDialogComponent } from './oc-anticipo-retirado-efectivo-anulacion-dialog/oc-anticipo-retirado-efectivo-anulacion-dialog.component';
import { OcAnticipoRetiradoInsumoAnulacionDialogComponent } from './oc-anticipo-retirado-insumo-anulacion-dialog/oc-anticipo-retirado-insumo-anulacion-dialog.component';



const modules = [
  CamionSemiNetoFormDialogComponent,
  ComentarioConfirmDialogComponent,
  ComplementoFormDialogComponent,
  ConfirmationDialogComponent,
  ContactoFormDialogComponent,
  DescuentoFormDialogComponent,
  FacturaFormDialogComponent,
  FleteConfirmationDialogComponent,
  InstrumentoFormDialogComponent,
  LiquidacionConfirmDialogComponent,
  LoadingDialogComponent,
  MovimientoEditByFleteFormDialogComponent,
  MovimientoEditByMermaFormDialogComponent,
  MovimientoFormDialogComponent,
  MovimientosSelectedDialogComponent,
  OcAnticipoRetiradoFormDialogComponent,
  OcComplementoFormDialogComponent,
  OcConfirmationDialogComponent,
  OcDescuentoFormDialogComponent,
  OcRemisionDestinoFormDialogComponent,
  OcRemisionOrigenFormDialogComponent,
  SeleccionableFormDialogComponent,
  SelectorDialogComponent,
  SelectorInMapDialogComponent,
  TipoCuentaFormDialogComponent,
  TipoMovimientoFormDialogComponent,
  UserFormDialogComponent,
  OcAnticipoRetiradoMockupComponent,
  OcGestionLineaComponent,
  OrdenCargaGestionAnticiposComponent,
  OrdenCargaFleteComponent,
  LiquidacionFormDialogComponent,
  ImageDialogComponent,
  OrdenCargaEstadoHistorialDialogComponent,
  CommentDialogComponent,
  EvaluacionesDialogComponent,
  EvaluacionesCancelarComponent,
  RemisionFormDialogComponent,
  OcRemitirDialogComponent,
  OcAnticipoRetiradoEfectivoDialogComponent,
  OcAnticipoRetiradoInsumoDialogComponent,
  OcAnticipoRetiradoEfectivoAnulacionDialogComponent,
  OcAnticipoRetiradoInsumoAnulacionDialogComponent,
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
    EstadoCuentaModule
  ],
})
export class DialogsModule {}
