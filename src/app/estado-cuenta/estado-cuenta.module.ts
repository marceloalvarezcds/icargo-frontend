import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstadoCuentaListComponent } from './estado-cuenta-list/estado-cuenta-list.component';
import { EstadoCuentaRoutingModule } from './estado-cuenta-routing.module';
import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';
import { LiquidacionListComponent } from './liquidacion-list/liquidacion-list.component';
import { EstadoCuentaDetalleComponent } from './estado-cuenta-detalle/estado-cuenta-detalle.component';
import { LiquidacionEditFormComponent } from './liquidacion-edit-form/liquidacion-edit-form.component';
import { LiquidacionEditFormMovimientosComponent } from './liquidacion-edit-form-movimientos/liquidacion-edit-form-movimientos.component';
import { LiquidacionEditFormAccionesComponent } from './liquidacion-edit-form-acciones/liquidacion-edit-form-acciones.component';
import { LiquidacionComentarioComponent } from './liquidacion-comentario/liquidacion-comentario.component';

@NgModule({
  declarations: [EstadoCuentaListComponent, LiquidacionFormComponent, LiquidacionListComponent, EstadoCuentaDetalleComponent, LiquidacionEditFormComponent, LiquidacionEditFormMovimientosComponent, LiquidacionEditFormAccionesComponent, LiquidacionComentarioComponent],
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
  ],
})
export class EstadoCuentaModule {}
