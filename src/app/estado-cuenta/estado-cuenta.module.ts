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

@NgModule({
  declarations: [EstadoCuentaListComponent, LiquidacionFormComponent],
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
