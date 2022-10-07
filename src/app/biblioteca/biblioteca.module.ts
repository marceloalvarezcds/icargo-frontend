import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BibliotecaRoutingModule } from './biblioteca-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BibliotecaRoutingModule,
    DirectivesModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class BibliotecaModule {}
