import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdenCargaCreateFormCombinacionComponent } from './orden-carga-create-form-combinacion/orden-carga-create-form-combinacion.component';
import { OrdenCargaCreateFormInfoComponent } from './orden-carga-create-form-info/orden-carga-create-form-info.component';
import { OrdenCargaCreateFormComponent } from './orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaEditFormAccionesComponent } from './orden-carga-edit-form-acciones/orden-carga-edit-form-acciones.component';
import { OrdenCargaEditFormAnticiposFleteComponent } from './orden-carga-edit-form-anticipos-flete/orden-carga-edit-form-anticipos-flete.component';
import { OrdenCargaEditFormAnticiposResumenComponent } from './orden-carga-edit-form-anticipos-resumen/orden-carga-edit-form-anticipos-resumen.component';
import { OrdenCargaEditFormAnticiposSaldosComponent } from './orden-carga-edit-form-anticipos-saldos/orden-carga-edit-form-anticipos-saldos.component';
import { OrdenCargaEditFormAnticiposComponent } from './orden-carga-edit-form-anticipos/orden-carga-edit-form-anticipos.component';
import { OrdenCargaEditFormCombinacionComponent } from './orden-carga-edit-form-combinacion/orden-carga-edit-form-combinacion.component';
import { OrdenCargaEditFormComplementosComponent } from './orden-carga-edit-form-complementos/orden-carga-edit-form-complementos.component';
import { OrdenCargaEditFormDescuentosComponent } from './orden-carga-edit-form-descuentos/orden-carga-edit-form-descuentos.component';
import { OrdenCargaEditFormEstadoHistorialComponent } from './orden-carga-edit-form-estado-historial/orden-carga-edit-form-estado-historial.component';
import { OrdenCargaEditFormInfoComponent } from './orden-carga-edit-form-info/orden-carga-edit-form-info.component';
import { OrdenCargaEditFormRemisionesDestinoComponent } from './orden-carga-edit-form-remisiones-destino/orden-carga-edit-form-remisiones-destino.component';
import { OrdenCargaEditFormRemisionesOrigenComponent } from './orden-carga-edit-form-remisiones-origen/orden-carga-edit-form-remisiones-origen.component';
import { OrdenCargaEditFormRemisionesResultadoComponent } from './orden-carga-edit-form-remisiones-resultado/orden-carga-edit-form-remisiones-resultado.component';
import { OrdenCargaEditFormTramoComponent } from './orden-carga-edit-form-tramo/orden-carga-edit-form-tramo.component';
import { OrdenCargaEditFormComponent } from './orden-carga-edit-form/orden-carga-edit-form.component';
import { OrdenCargaListComponent } from './orden-carga-list/orden-carga-list.component';
import { OrdenCargaRoutingModule } from './orden-carga-routing.module';
import { OrdenCargaEditFormAuditoriasComponent } from './orden-carga-edit-form-auditorias/orden-carga-edit-form-auditorias.component';
import { OrdenCargaEditFormMovimientosComponent } from './orden-carga-edit-form-movimientos/orden-carga-edit-form-movimientos.component';
import { OrdenCargaAnticiposTableComponent } from './orden-carga-anticipos-table/orden-carga-anticipos-table.component';
import { OrdenCargaAnticiposTableButtonComponent } from './orden-carga-anticipos-table-button/orden-carga-anticipos-table-button.component';
import { OrdenCargaReportsComponent } from './orden-carga-reports/orden-carga-reports.component';
import { OrdenCargaNuevoAnticipoFormComponent } from './orden-carga-nuevo-anticipo-form/orden-carga-nuevo-anticipo-form.component';
import { OrdenCargaAccionesFormCombinacionOcComponent } from './orden-carga-acciones-form-combinacion-oc/orden-carga-acciones-form-combinacion-oc.component';
import { OrdenCargaCreateFormRecepcionComponent } from './orden-carga-create-form-recepcion/orden-carga-create-form-recepcion.component';
import { OrdenCargaFormAceptarComponent } from './orden-carga-form-aceptar/orden-carga-form-aceptar.component';
import { OrdenCargaFinalizarFormComponent } from './orden-carga-finalizar-form/orden-carga-finalizar-form.component';
import { OrdenCargaRecepcionFormComponent } from './orden-carga-recepcion-form/orden-carga-recepcion-form.component';
import { OrdenCargaConciliarFormComponent } from './orden-carga-conciliar-form/orden-carga-conciliar-form.component';
import { PdfPreviewDialogComponent } from './pdf-preview-dialog/pdf-preview-dialog.component';
import { SafeUrlPipe } from './safe-url.pipe';



@NgModule({
  declarations: [
    OrdenCargaCreateFormCombinacionComponent,
    OrdenCargaCreateFormComponent,
    OrdenCargaCreateFormInfoComponent,
    OrdenCargaEditFormAccionesComponent,
    OrdenCargaEditFormAnticiposComponent,
    OrdenCargaEditFormAnticiposFleteComponent,
    OrdenCargaEditFormAnticiposResumenComponent,
    OrdenCargaEditFormAnticiposSaldosComponent,
    OrdenCargaEditFormCombinacionComponent,
    OrdenCargaEditFormComplementosComponent,
    OrdenCargaEditFormComponent,
    OrdenCargaEditFormDescuentosComponent,
    OrdenCargaEditFormEstadoHistorialComponent,
    OrdenCargaEditFormInfoComponent,
    OrdenCargaEditFormRemisionesDestinoComponent,
    OrdenCargaEditFormRemisionesOrigenComponent,
    OrdenCargaEditFormRemisionesResultadoComponent,
    OrdenCargaEditFormTramoComponent,
    OrdenCargaListComponent,
    OrdenCargaEditFormAuditoriasComponent,
    OrdenCargaEditFormMovimientosComponent,
    OrdenCargaAnticiposTableComponent,
    OrdenCargaAnticiposTableButtonComponent,
    OrdenCargaReportsComponent,
    OrdenCargaNuevoAnticipoFormComponent,
    OrdenCargaAccionesFormCombinacionOcComponent,
    OrdenCargaCreateFormRecepcionComponent,
    OrdenCargaFormAceptarComponent,
    OrdenCargaFinalizarFormComponent,
    OrdenCargaRecepcionFormComponent,
    OrdenCargaConciliarFormComponent,
    PdfPreviewDialogComponent,
    SafeUrlPipe,
 
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    OrdenCargaRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
  entryComponents: [PdfPreviewDialogComponent] 
})
export class OrdenCargaModule {}
