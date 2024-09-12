import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstadoCuentaDetalleComponent } from './estado-cuenta-detalle/estado-cuenta-detalle.component';
import { EstadoCuentaListComponent } from './estado-cuenta-list/estado-cuenta-list.component';
import { EstadoCuentaRoutingModule } from './estado-cuenta-routing.module';
import { LiquidacionComentarioComponent } from './liquidacion-comentario/liquidacion-comentario.component';
import { LiquidacionConfirmadaFormFacturasComponent } from './liquidacion-confirmada-form-facturas/liquidacion-confirmada-form-facturas.component';
import { LiquidacionConfirmadaFormInstrumentosComponent } from './liquidacion-confirmada-form-instrumentos/liquidacion-confirmada-form-instrumentos.component';
import { LiquidacionConfirmadaFormComponent } from './liquidacion-confirmada-form/liquidacion-confirmada-form.component';
import { LiquidacionEditFormAccionesComponent } from './liquidacion-edit-form-acciones/liquidacion-edit-form-acciones.component';
import { LiquidacionEditFormMovimientosComponent } from './liquidacion-edit-form-movimientos/liquidacion-edit-form-movimientos.component';
import { LiquidacionEditFormComponent } from './liquidacion-edit-form/liquidacion-edit-form.component';
import { LiquidacionFinalizadaComponent } from './liquidacion-finalizada/liquidacion-finalizada.component';
import { LiquidacionFormMovimientosComponent } from './liquidacion-form-movimientos/liquidacion-form-movimientos.component';
import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';
import { LiquidacionInstrumentosComponent } from './liquidacion-instrumentos/liquidacion-instrumentos.component';
import { LiquidacionListComponent } from './liquidacion-list/liquidacion-list.component';
import { LiquidacionMovimientosComponent } from './liquidacion-movimientos/liquidacion-movimientos.component';
import { OperacionComponent } from './operacion/operacion.component';
import { SaldoComponent } from './saldo/saldo.component';
import { EstadoCuentaListDetalleComponent } from './estado-cuenta-list-detalle/estado-cuenta-list-detalle.component';
import { LiquidacionesListComponent } from './liquidaciones-list/liquidaciones-list.component';
import { LiquidacionFormFieldsComponent } from './liquidacion-form-fields/liquidacion-form-fields.component';
import { LiquidacionEditFieldsComponent } from './liquidacion-edit-fields/liquidacion-edit-fields.component';

@NgModule({
  declarations: [
    EstadoCuentaListComponent,
    LiquidacionFormComponent,
    LiquidacionListComponent,
    EstadoCuentaDetalleComponent,
    LiquidacionEditFormComponent,
    LiquidacionEditFormMovimientosComponent,
    LiquidacionEditFormAccionesComponent,
    LiquidacionComentarioComponent,
    LiquidacionConfirmadaFormFacturasComponent,
    LiquidacionConfirmadaFormComponent,
    LiquidacionConfirmadaFormInstrumentosComponent,
    LiquidacionInstrumentosComponent,
    LiquidacionFinalizadaComponent,
    LiquidacionMovimientosComponent,
    LiquidacionFormMovimientosComponent,
    OperacionComponent,
    SaldoComponent,
    EstadoCuentaListDetalleComponent,
    LiquidacionesListComponent,
    LiquidacionFormFieldsComponent,
    LiquidacionEditFieldsComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    EstadoCuentaRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
    RouterModule,
  ],
  exports: [
    EstadoCuentaDetalleComponent,
    SaldoComponent,
    LiquidacionFormMovimientosComponent,
    LiquidacionFormFieldsComponent,
    LiquidacionEditFieldsComponent
  ]
})
export class EstadoCuentaModule {}
