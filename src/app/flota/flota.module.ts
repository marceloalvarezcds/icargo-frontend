import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlotaRoutingModule } from './flota-routing.module';
import { PropietarioListComponent } from './propietario-list/propietario-list.component';
import { PropietarioFormComponent } from './propietario-form/propietario-form.component';
import { PropietarioFormInfoComponent } from './propietario-form-info/propietario-form-info.component';
import { RegistroConduccionFormComponent } from './registro-conduccion-form/registro-conduccion-form.component';
import { PropietarioCamionListComponent } from './propietario-camion-list/propietario-camion-list.component';
import { PropietarioSemiListComponent } from './propietario-semi-list/propietario-semi-list.component';
import { PropietarioFormChoferComponent } from './propietario-form-chofer/propietario-form-chofer.component';
import { ChoferListComponent } from './chofer-list/chofer-list.component';
import { ChoferFormComponent } from './chofer-form/chofer-form.component';
import { ChoferFormInfoComponent } from './chofer-form-info/chofer-form-info.component';
import { ChoferFormPropietarioComponent } from './chofer-form-propietario/chofer-form-propietario.component';
import { PermisoPipe } from '../pipes/permiso.pipe';


@NgModule({
  declarations: [
    PropietarioListComponent,
    PropietarioFormComponent,
    PropietarioFormInfoComponent,
    RegistroConduccionFormComponent,
    PropietarioCamionListComponent,
    PropietarioSemiListComponent,
    PropietarioFormChoferComponent,
    ChoferListComponent,
    ChoferFormComponent,
    ChoferFormInfoComponent,
    ChoferFormPropietarioComponent,
  ],
  imports: [
    CommonModule,
    FlotaRoutingModule,
    FormFieldModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
  providers: [ PermisoPipe ],
})
export class FlotaModule { }
