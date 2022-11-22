import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { FleteFormAccionesComponent } from './flete-form-acciones/flete-form-acciones.component';
import { FleteFormAnticiposComponent } from './flete-form-anticipos/flete-form-anticipos.component';
import { FleteFormComplementosComponent } from './flete-form-complementos/flete-form-complementos.component';
import { FleteFormCondicionAfectadoComponent } from './flete-form-condicion-afectado/flete-form-condicion-afectado.component';
import { FleteFormCondicionComponent } from './flete-form-condicion/flete-form-condicion.component';
import { FleteFormDescuentosComponent } from './flete-form-descuentos/flete-form-descuentos.component';
import { FleteFormEmisionOrdenComponent } from './flete-form-emision-orden/flete-form-emision-orden.component';
import { FleteFormInfoComponent } from './flete-form-info/flete-form-info.component';
import { FleteFormMermaComponent } from './flete-form-merma/flete-form-merma.component';
import { FleteFormTramoComponent } from './flete-form-tramo/flete-form-tramo.component';
import { FleteFormComponent } from './flete-form/flete-form.component';
import { FleteListComponent } from './flete-list/flete-list.component';
import { FleteRoutingModule } from './flete-routing.module';

@NgModule({
  declarations: [
    FleteFormAccionesComponent,
    FleteFormAnticiposComponent,
    FleteFormComplementosComponent,
    FleteFormComponent,
    FleteFormCondicionAfectadoComponent,
    FleteFormCondicionComponent,
    FleteFormDescuentosComponent,
    FleteFormEmisionOrdenComponent,
    FleteFormInfoComponent,
    FleteFormMermaComponent,
    FleteFormTramoComponent,
    FleteListComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    FleteRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class FleteModule {}
