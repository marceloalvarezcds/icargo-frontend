import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BancoRoutingModule } from './banco-routing.module';
import { BancoListComponent } from './banco-list/banco-list.component';
import { BancoFormComponent } from './banco-form/banco-form.component';

@NgModule({
  declarations: [BancoListComponent, BancoFormComponent],
  imports: [
    BancoRoutingModule,
    CommonModule,
    DirectivesModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class BancoModule {}
