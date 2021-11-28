import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FileFieldComponent } from './file-field/file-field.component';
import { TipoDocumentoFieldComponent } from './tipo-documento-field/tipo-documento-field.component';
import { PaisFieldComponent } from './pais-field/pais-field.component';
import { LocalidadFieldComponent } from './localidad-field/localidad-field.component';
import { CiudadFieldComponent } from './ciudad-field/ciudad-field.component';
import { TipoRegistroFieldComponent } from './tipo-registro-field/tipo-registro-field.component';
import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { TipoPersonaFieldComponent } from './tipo-persona-field/tipo-persona-field.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { DigitoVerificadorFieldComponent } from './digito-verificador-field/digito-verificador-field.component';
import { TelefonoFieldComponent } from './telefono-field/telefono-field.component';
import { EmailFieldComponent } from './email-field/email-field.component';
import { OficialCuentaFieldComponent } from './oficial-cuenta-field/oficial-cuenta-field.component';
import { AliasFieldComponent } from './alias-field/alias-field.component';

const modules = [
  AliasFieldComponent,
  CiudadFieldComponent,
  DigitoVerificadorFieldComponent,
  EmailFieldComponent,
  FechaFieldComponent,
  FileFieldComponent,
  InputFieldComponent,
  LocalidadFieldComponent,
  OficialCuentaFieldComponent,
  PaisFieldComponent,
  TelefonoFieldComponent,
  TipoDocumentoFieldComponent,
  TipoPersonaFieldComponent,
  TipoRegistroFieldComponent,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
  ],
})
export class FormFieldModule { }
