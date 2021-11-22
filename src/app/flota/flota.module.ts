import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlotaRoutingModule } from './flota-routing.module';
import { PropietarioListComponent } from './propietario-list/propietario-list.component';
import { PropietarioFormComponent } from './propietario-form/propietario-form.component';
import { PropietarioFormInfoComponent } from './propietario-form-info/propietario-form-info.component';


@NgModule({
  declarations: [
    PropietarioListComponent,
    PropietarioFormComponent,
    PropietarioFormInfoComponent
  ],
  imports: [
    CommonModule,
    FlotaRoutingModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ]
})
export class FlotaModule { }
