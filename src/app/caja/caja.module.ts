import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CajaFormComponent } from './caja-form/caja-form.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaRoutingModule } from './caja-routing.module';
import { CajaFormInstrumentosComponent } from './caja-form-instrumentos/caja-form-instrumentos.component';

@NgModule({
  declarations: [CajaFormComponent, CajaListComponent, CajaFormInstrumentosComponent],
  imports: [
    CajaRoutingModule,
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
export class CajaModule {}
