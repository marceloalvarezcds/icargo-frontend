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

@NgModule({
  declarations: [
    OrdenCargaListComponent,
    OrdenCargaCreateFormComponent,
    OrdenCargaCreateFormCombinacionComponent,
    OrdenCargaCreateFormInfoComponent,
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
