import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AliasFieldComponent } from './alias-field/alias-field.component';
import { BancoByGestorDialogFieldComponent } from './banco-by-gestor-dialog-field/banco-by-gestor-dialog-field.component';
import { CajaByGestorDialogFieldComponent } from './caja-by-gestor-dialog-field/caja-by-gestor-dialog-field.component';
import { CamionByGestorFieldComponent } from './camion-by-gestor-field/camion-by-gestor-field.component';
import { CamionByProductoFieldComponent } from './camion-by-producto-field/camion-by-producto-field.component';
import { CentroOperativoByGestorDialogFieldComponent } from './centro-operativo-by-gestor-dialog-field/centro-operativo-by-gestor-dialog-field.component';
import { CentroOperativoFieldComponent } from './centro-operativo-field/centro-operativo-field.component';
import { ChoferFieldComponent } from './chofer-field/chofer-field.component';
import { CiudadDialogFieldComponent } from './ciudad-dialog-field/ciudad-dialog-field.component';
import { CiudadFieldComponent } from './ciudad-field/ciudad-field.component';
import { ColorFieldComponent } from './color-field/color-field.component';
import { ContraparteFieldComponent } from './contraparte-field/contraparte-field.component';
import { DialogFieldComponent } from './dialog-field/dialog-field.component';
import { DigitoVerificadorFieldComponent } from './digito-verificador-field/digito-verificador-field.component';
import { EmailFieldComponent } from './email-field/email-field.component';
import { EnteEmisorAutomotorFieldComponent } from './ente-emisor-automotor-field/ente-emisor-automotor-field.component';
import { EnteEmisorTransporteFieldComponent } from './ente-emisor-transporte-field/ente-emisor-transporte-field.component';
import { EstadoFieldComponent } from './estado-field/estado-field.component';
import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { FileFieldComponent } from './file-field/file-field.component';
import { FleteByGestorDialogFieldComponent } from './flete-by-gestor-dialog-field/flete-by-gestor-dialog-field.component';
import { GenericListFieldComponent } from './generic-list-field/generic-list-field.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { InstrumentoViaFieldComponent } from './instrumento-via-field/instrumento-via-field.component';
import { InsumoByTipoFieldComponent } from './insumo-by-tipo-field/insumo-by-tipo-field.component';
import { LocalidadFieldComponent } from './localidad-field/localidad-field.component';
import { MarcaCamionFieldComponent } from './marca-camion-field/marca-camion-field.component';
import { MarcaSemiFieldComponent } from './marca-semi-field/marca-semi-field.component';
import { MonedaByInsumoPuntoVentaFieldComponent } from './moneda-by-insumo-punto-venta-field/moneda-by-insumo-punto-venta-field.component';
import { MonedaFieldComponent } from './moneda-field/moneda-field.component';
import { NumberFieldComponent } from './number-field/number-field.component';
import { OficialCuentaFieldComponent } from './oficial-cuenta-field/oficial-cuenta-field.component';
import { OrdenCargaRemisionOrigenFieldComponent } from './orden-carga-remision-origen-field/orden-carga-remision-origen-field.component';
import { PaisFieldComponent } from './pais-field/pais-field.component';
import { ProductoByGestorDialogFieldComponent } from './producto-by-gestor-dialog-field/producto-by-gestor-dialog-field.component';
import { ProductoFieldComponent } from './producto-field/producto-field.component';
import { PropietarioFieldComponent } from './propietario-field/propietario-field.component';
import { ProveedorByInsumoFieldComponent } from './proveedor-by-insumo-field/proveedor-by-insumo-field.component';
import { ProveedorFieldComponent } from './proveedor-field/proveedor-field.component';
import { PuntoVentaByInsumoProveedorFieldComponent } from './punto-venta-by-insumo-proveedor-field/punto-venta-by-insumo-proveedor-field.component';
import { PuntoVentaByProveedorFieldComponent } from './punto-venta-by-proveedor-field/punto-venta-by-proveedor-field.component';
import { RemitenteFieldComponent } from './remitente-field/remitente-field.component';
import { SemiByCamionProductoFieldComponent } from './semi-by-camion-producto-field/semi-by-camion-producto-field.component';
import { SemiByGestorDialogFieldComponent } from './semi-by-gestor-dialog-field/semi-by-gestor-dialog-field.component';
import { SemiClasificacionFieldComponent } from './semi-clasificacion-field/semi-clasificacion-field.component';
import { TelefonoFieldComponent } from './telefono-field/telefono-field.component';
import { TipoAnticipoByFleteFieldComponent } from './tipo-anticipo-by-flete-field/tipo-anticipo-by-flete-field.component';
import { TipoAnticipoFieldComponent } from './tipo-anticipo-field/tipo-anticipo-field.component';
import { TipoCamionFieldComponent } from './tipo-camion-field/tipo-camion-field.component';
import { TipoCargaFieldComponent } from './tipo-carga-field/tipo-carga-field.component';
import { TipoComprobanteFieldComponent } from './tipo-comprobante-field/tipo-comprobante-field.component';
import { TipoConceptoComplementoFieldComponent } from './tipo-concepto-complemento-field/tipo-concepto-complemento-field.component';
import { TipoConceptoDescuentoFieldComponent } from './tipo-concepto-descuento-field/tipo-concepto-descuento-field.component';
import { TipoContraparteFieldComponent } from './tipo-contraparte-field/tipo-contraparte-field.component';
import { TipoDocumentoFieldComponent } from './tipo-documento-field/tipo-documento-field.component';
import { TipoInstrumentoViaBancoFieldComponent } from './tipo-instrumento-via-banco-field/tipo-instrumento-via-banco-field.component';
import { TipoInsumoByFleteFieldComponent } from './tipo-insumo-by-flete-field/tipo-insumo-by-flete-field.component';
import { TipoIvaFieldComponent } from './tipo-iva-field/tipo-iva-field.component';
import { TipoPersonaFieldComponent } from './tipo-persona-field/tipo-persona-field.component';
import { TipoRegistroFieldComponent } from './tipo-registro-field/tipo-registro-field.component';
import { TipoSemiFieldComponent } from './tipo-semi-field/tipo-semi-field.component';
import { UnidadFieldComponent } from './unidad-field/unidad-field.component';

const modules = [
  AliasFieldComponent,
  BancoByGestorDialogFieldComponent,
  CajaByGestorDialogFieldComponent,
  CamionByGestorFieldComponent,
  CamionByProductoFieldComponent,
  CentroOperativoByGestorDialogFieldComponent,
  CentroOperativoFieldComponent,
  ChoferFieldComponent,
  CiudadDialogFieldComponent,
  CiudadFieldComponent,
  ColorFieldComponent,
  ContraparteFieldComponent,
  DialogFieldComponent,
  DigitoVerificadorFieldComponent,
  EmailFieldComponent,
  EnteEmisorAutomotorFieldComponent,
  EnteEmisorTransporteFieldComponent,
  EstadoFieldComponent,
  FechaFieldComponent,
  FileFieldComponent,
  FleteByGestorDialogFieldComponent,
  GenericListFieldComponent,
  InputFieldComponent,
  InstrumentoViaFieldComponent,
  InsumoByTipoFieldComponent,
  LocalidadFieldComponent,
  MarcaCamionFieldComponent,
  MarcaSemiFieldComponent,
  MonedaByInsumoPuntoVentaFieldComponent,
  MonedaFieldComponent,
  NumberFieldComponent,
  OficialCuentaFieldComponent,
  OrdenCargaRemisionOrigenFieldComponent,
  PaisFieldComponent,
  ProductoByGestorDialogFieldComponent,
  ProductoFieldComponent,
  PropietarioFieldComponent,
  ProveedorByInsumoFieldComponent,
  ProveedorFieldComponent,
  PuntoVentaByInsumoProveedorFieldComponent,
  PuntoVentaByProveedorFieldComponent,
  RemitenteFieldComponent,
  SemiByCamionProductoFieldComponent,
  SemiByGestorDialogFieldComponent,
  SemiClasificacionFieldComponent,
  TelefonoFieldComponent,
  TipoAnticipoByFleteFieldComponent,
  TipoAnticipoFieldComponent,
  TipoCamionFieldComponent,
  TipoCargaFieldComponent,
  TipoComprobanteFieldComponent,
  TipoConceptoComplementoFieldComponent,
  TipoConceptoDescuentoFieldComponent,
  TipoContraparteFieldComponent,
  TipoDocumentoFieldComponent,
  TipoInstrumentoViaBancoFieldComponent,
  TipoInsumoByFleteFieldComponent,
  TipoIvaFieldComponent,
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
export class FormFieldModule {}
