import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { FleteRoutingModule } from './flete-routing.module';
import { FleteListComponent } from './flete-list/flete-list.component';
import { FleteFormComponent } from './flete-form/flete-form.component';

@NgModule({
  declarations: [
    FleteListComponent,
    FleteFormComponent
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
  ]
})
export class FleteModule { }
