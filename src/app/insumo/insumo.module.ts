import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { InsumoListComponent } from './insumo-list/insumo-list.component';
import { InsumoRoutingModule } from './insumo-routing.module';



@NgModule({
  declarations: [

  InsumoListComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    InsumoRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ]
})
export class InsumoModule { }
