import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCargaAnticiposRoutingModule } from './orden-carga-anticipos-routing.module';
import { OrdenCargaAnticiposListComponent } from './orden-carga-anticipos-list/orden-carga-anticipos-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdenCargaAnticiposFormComponent } from './orden-carga-anticipos-form/orden-carga-anticipos-form.component';
import { OrdenCargaModule } from '../orden-carga/orden-carga.module';
import { OrdenCargaAnticiposEditFormComponent } from './orden-carga-anticipos-edit-form/orden-carga-anticipos-edit-form.component';



@NgModule({
  declarations: [
    OrdenCargaAnticiposListComponent,
    OrdenCargaAnticiposFormComponent,
    OrdenCargaAnticiposEditFormComponent
  ],
  imports: [
    CommonModule,
    OrdenCargaAnticiposRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
    DirectivesModule,
    OrdenCargaModule,
  ]
})
export class OrdenCargaAnticiposModule { }
