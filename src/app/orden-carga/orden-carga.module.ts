import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrdenCargaRoutingModule } from './orden-carga-routing.module';
import { OrdenCargaListComponent } from './orden-carga-list/orden-carga-list.component';
import { OrdenCargaCreateFormComponent } from './orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaCreateFormCombinacionComponent } from './orden-carga-create-form-combinacion/orden-carga-create-form-combinacion.component';
import { OrdenCargaCreateFormInfoComponent } from './orden-carga-create-form-info/orden-carga-create-form-info.component';
import { OrdenCargaEditFormComponent } from './orden-carga-edit-form/orden-carga-edit-form.component';
import { OrdenCargaEditFormAnticiposComponent } from './orden-carga-edit-form-anticipos/orden-carga-edit-form-anticipos.component';
import { OrdenCargaEditFormComplementosComponent } from './orden-carga-edit-form-complementos/orden-carga-edit-form-complementos.component';
import { OrdenCargaEditFormDescuentosComponent } from './orden-carga-edit-form-descuentos/orden-carga-edit-form-descuentos.component';
import { OrdenCargaEditFormRemisionesDestinoComponent } from './orden-carga-edit-form-remisiones-destino/orden-carga-edit-form-remisiones-destino.component';
import { OrdenCargaEditFormRemisionesOrigenComponent } from './orden-carga-edit-form-remisiones-origen/orden-carga-edit-form-remisiones-origen.component';
import { OrdenCargaEditFormAccionesComponent } from './orden-carga-edit-form-acciones/orden-carga-edit-form-acciones.component';
import { OrdenCargaEditFormInfoComponent } from './orden-carga-edit-form-info/orden-carga-edit-form-info.component';
import { OrdenCargaEditFormCombinacionComponent } from './orden-carga-edit-form-combinacion/orden-carga-edit-form-combinacion.component';
import { OrdenCargaEditFormTramoComponent } from './orden-carga-edit-form-tramo/orden-carga-edit-form-tramo.component';

@NgModule({
  declarations: [
    OrdenCargaListComponent,
    OrdenCargaCreateFormComponent,
    OrdenCargaCreateFormCombinacionComponent,
    OrdenCargaCreateFormInfoComponent,
    OrdenCargaEditFormComponent,
    OrdenCargaEditFormAnticiposComponent,
    OrdenCargaEditFormComplementosComponent,
    OrdenCargaEditFormDescuentosComponent,
    OrdenCargaEditFormRemisionesDestinoComponent,
    OrdenCargaEditFormRemisionesOrigenComponent,
    OrdenCargaEditFormAccionesComponent,
    OrdenCargaEditFormInfoComponent,
    OrdenCargaEditFormCombinacionComponent,
    OrdenCargaEditFormTramoComponent,
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
})
export class OrdenCargaModule { }
