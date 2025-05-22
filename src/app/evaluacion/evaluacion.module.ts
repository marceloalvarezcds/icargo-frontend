import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluacionListComponent } from './evaluacion-list/evaluacion-list.component';
import { EvaluacionRoutingModule } from './evaluacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluacionFormComponent } from './evaluacion-form/evaluacion-form.component';


@NgModule({
  declarations: [
    EvaluacionListComponent,
    EvaluacionFormComponent
  ],
  imports: [
    CommonModule,
    EvaluacionRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,

  ]
})
export class EvaluacionModule { }
