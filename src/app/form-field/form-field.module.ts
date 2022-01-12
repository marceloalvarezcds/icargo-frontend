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
import { CamionByGestorFieldComponent } from './camion-by-gestor-field/camion-by-gestor-field.component';
import { CamionByProductoFieldComponent } from './camion-by-producto-field/camion-by-producto-field.component';
import { CentroOperativoFieldComponent } from './centro-operativo-field/centro-operativo-field.component';
import { ChoferFieldComponent } from './chofer-field/chofer-field.component';
import { ColorFieldComponent } from './color-field/color-field.component';
import { DialogFieldComponent } from './dialog-field/dialog-field.component';
import { EnteEmisorAutomotorFieldComponent } from './ente-emisor-automotor-field/ente-emisor-automotor-field.component';
import { EnteEmisorTransporteFieldComponent } from './ente-emisor-transporte-field/ente-emisor-transporte-field.component';
import { EstadoFieldComponent } from './estado-field/estado-field.component';
import { FleteByGestorDialogFieldComponent } from './flete-by-gestor-dialog-field/flete-by-gestor-dialog-field.component';
import { MarcaCamionFieldComponent } from './marca-camion-field/marca-camion-field.component';
import { MarcaSemiFieldComponent } from './marca-semi-field/marca-semi-field.component';
import { MonedaFieldComponent } from './moneda-field/moneda-field.component';
import { NumberFieldComponent } from './number-field/number-field.component';
import { ProductoFieldComponent } from './producto-field/producto-field.component';
import { PropietarioFieldComponent } from './propietario-field/propietario-field.component';
import { RemitenteFieldComponent } from './remitente-field/remitente-field.component';
import { SemiByCamionProductoFieldComponent } from './semi-by-camion-producto-field/semi-by-camion-producto-field.component';
import { SemiClasificacionFieldComponent } from './semi-clasificacion-field/semi-clasificacion-field.component';
import { TipoAnticipoFieldComponent } from './tipo-anticipo-field/tipo-anticipo-field.component';
import { TipoCamionFieldComponent } from './tipo-camion-field/tipo-camion-field.component';
import { TipoCargaFieldComponent } from './tipo-carga-field/tipo-carga-field.component';
import { TipoConceptoComplementoFieldComponent } from './tipo-concepto-complemento-field/tipo-concepto-complemento-field.component';
import { TipoConceptoDescuentoFieldComponent } from './tipo-concepto-descuento-field/tipo-concepto-descuento-field.component';
import { TipoSemiFieldComponent } from './tipo-semi-field/tipo-semi-field.component';
import { UnidadFieldComponent } from './unidad-field/unidad-field.component';
import { ProveedorFieldComponent } from './proveedor-field/proveedor-field.component';

const modules = [
  AliasFieldComponent,
  CamionByGestorFieldComponent,
  CamionByProductoFieldComponent,
  CentroOperativoFieldComponent,
  ChoferFieldComponent,
  CiudadFieldComponent,
  ColorFieldComponent,
  DialogFieldComponent,
  DigitoVerificadorFieldComponent,
  EmailFieldComponent,
  EnteEmisorAutomotorFieldComponent,
  EnteEmisorTransporteFieldComponent,
  EstadoFieldComponent,
  FechaFieldComponent,
  FileFieldComponent,
  FleteByGestorDialogFieldComponent,
  InputFieldComponent,
  LocalidadFieldComponent,
  MarcaCamionFieldComponent,
  MarcaSemiFieldComponent,
  MonedaFieldComponent,
  NumberFieldComponent,
  OficialCuentaFieldComponent,
  PaisFieldComponent,
  ProductoFieldComponent,
  PropietarioFieldComponent,
  ProveedorFieldComponent,
  RemitenteFieldComponent,
  SemiByCamionProductoFieldComponent,
  SemiClasificacionFieldComponent,
  TelefonoFieldComponent,
  TipoAnticipoFieldComponent,
  TipoCamionFieldComponent,
  TipoCargaFieldComponent,
  TipoConceptoComplementoFieldComponent,
  TipoConceptoDescuentoFieldComponent,
  TipoDocumentoFieldComponent,
  TipoPersonaFieldComponent,
  TipoRegistroFieldComponent,
  TipoSemiFieldComponent,
  UnidadFieldComponent,
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
