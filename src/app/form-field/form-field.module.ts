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
import { CamionByProductoDialogFieldComponent } from './camion-by-producto-dialog-field/camion-by-producto-dialog-field.component';
import { CargoFieldComponent } from './cargo-field/cargo-field.component';
import { CentroOperativoByGestorDialogFieldComponent } from './centro-operativo-by-gestor-dialog-field/centro-operativo-by-gestor-dialog-field.component';
import { CentroOperativoByGestorMapDialogFieldComponent } from './centro-operativo-by-gestor-map-dialog-field/centro-operativo-by-gestor-map-dialog-field.component';
import { CentroOperativoFieldComponent } from './centro-operativo-field/centro-operativo-field.component';
import { ChoferByCamionDialogFieldComponent } from './chofer-by-camion-dialog-field/chofer-by-camion-dialog-field.component';
import { ChoferFieldComponent } from './chofer-field/chofer-field.component';
import { CiudadDialogFieldComponent } from './ciudad-dialog-field/ciudad-dialog-field.component';
import { CiudadFieldComponent } from './ciudad-field/ciudad-field.component';
import { ColorFieldComponent } from './color-field/color-field.component';
import { ContraparteByTipoDialogFieldComponent } from './contraparte-by-tipo-dialog-field/contraparte-by-tipo-dialog-field.component';
import { ContraparteFieldComponent } from './contraparte-field/contraparte-field.component';
import { DialogFieldComponent } from './dialog-field/dialog-field.component';
import { DialogFormFieldControlComponent } from './dialog-form-field-control/dialog-form-field-control.component';
import { DigitoVerificadorFieldComponent } from './digito-verificador-field/digito-verificador-field.component';
import { EmailFieldComponent } from './email-field/email-field.component';
import { EnteEmisorAutomotorFieldComponent } from './ente-emisor-automotor-field/ente-emisor-automotor-field.component';
import { EnteEmisorTransporteFieldComponent } from './ente-emisor-transporte-field/ente-emisor-transporte-field.component';
import { EstadoFieldComponent } from './estado-field/estado-field.component';
import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { FileFieldComponent } from './file-field/file-field.component';
import { FleteByGestorDialogFieldComponent } from './flete-by-gestor-dialog-field/flete-by-gestor-dialog-field.component';
import { GenericListFieldComponent } from './generic-list-field/generic-list-field.component';
import { GestorCargaDialogFieldComponent } from './gestor-carga-dialog-field/gestor-carga-dialog-field.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { InstrumentoViaFieldComponent } from './instrumento-via-field/instrumento-via-field.component';
import { InsumoByTipoFieldComponent } from './insumo-by-tipo-field/insumo-by-tipo-field.component';
import { InsumoPuntoVentaPrecioMapDialogFieldComponent } from './insumo-punto-venta-precio-map-dialog-field/insumo-punto-venta-precio-map-dialog-field.component';
import { LocalidadFieldComponent } from './localidad-field/localidad-field.component';
import { MarcaCamionFieldComponent } from './marca-camion-field/marca-camion-field.component';
import { MarcaSemiFieldComponent } from './marca-semi-field/marca-semi-field.component';
import { MonedaByInsumoPuntoVentaFieldComponent } from './moneda-by-insumo-punto-venta-field/moneda-by-insumo-punto-venta-field.component';
import { MonedaFieldComponent } from './moneda-field/moneda-field.component';
import { NumberFieldComponent } from './number-field/number-field.component';
import { OficialCuentaFieldComponent } from './oficial-cuenta-field/oficial-cuenta-field.component';
import { OrdenCargaRemisionOrigenFieldComponent } from './orden-carga-remision-origen-field/orden-carga-remision-origen-field.component';
import { PaisFieldComponent } from './pais-field/pais-field.component';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { PermisoFieldComponent } from './permiso-field/permiso-field.component';
import { AccionPipe } from './permiso-form-field-control/accion.pipe';
import { PermisoFormFieldControlComponent } from './permiso-form-field-control/permiso-form-field-control.component';
import { ProductoByGestorDialogFieldComponent } from './producto-by-gestor-dialog-field/producto-by-gestor-dialog-field.component';
import { ProductoFieldComponent } from './producto-field/producto-field.component';
import { PropietarioFieldComponent } from './propietario-field/propietario-field.component';
import { PropietarioReadonlyByIdDialogFieldComponent } from './propietario-readonly-by-id-dialog-field/propietario-readonly-by-id-dialog-field.component';
import { ProveedorByInsumoFieldComponent } from './proveedor-by-insumo-field/proveedor-by-insumo-field.component';
import { ProveedorFieldComponent } from './proveedor-field/proveedor-field.component';
import { PuntoVentaByInsumoProveedorFieldComponent } from './punto-venta-by-insumo-proveedor-field/punto-venta-by-insumo-proveedor-field.component';
import { PuntoVentaByProveedorFieldComponent } from './punto-venta-by-proveedor-field/punto-venta-by-proveedor-field.component';
import { PuntoVentaMapDialogFieldComponent } from './punto-venta-map-dialog-field/punto-venta-map-dialog-field.component';
import { RemitenteByGestorMapDialogFieldComponent } from './remitente-by-gestor-map-dialog-field/remitente-by-gestor-map-dialog-field.component';
import { RemitenteFieldComponent } from './remitente-field/remitente-field.component';
import { RolFieldComponent } from './rol-field/rol-field.component';
import { RolFormFieldControlComponent } from './rol-form-field-control/rol-form-field-control.component';
import { SemiByCamionProductoDialogFieldComponent } from './semi-by-camion-producto-dialog-field/semi-by-camion-producto-dialog-field.component';
import { SemiByGestorDialogFieldComponent } from './semi-by-gestor-dialog-field/semi-by-gestor-dialog-field.component';
import { SemiClasificacionFieldComponent } from './semi-clasificacion-field/semi-clasificacion-field.component';
import { SlideComponent } from './slide/slide.component';
import { TelefonoFieldComponent } from './telefono-field/telefono-field.component';
import { TipoAnticipoByFleteFieldComponent } from './tipo-anticipo-by-flete-field/tipo-anticipo-by-flete-field.component';
import { TipoAnticipoFieldComponent } from './tipo-anticipo-field/tipo-anticipo-field.component';
import { TipoCamionFieldComponent } from './tipo-camion-field/tipo-camion-field.component';
import { TipoCargaFieldComponent } from './tipo-carga-field/tipo-carga-field.component';
import { TipoComprobanteFieldComponent } from './tipo-comprobante-field/tipo-comprobante-field.component';
import { TipoConceptoComplementoFieldComponent } from './tipo-concepto-complemento-field/tipo-concepto-complemento-field.component';
import { TipoConceptoDescuentoFieldComponent } from './tipo-concepto-descuento-field/tipo-concepto-descuento-field.component';
import { TipoContraparteFieldComponent } from './tipo-contraparte-field/tipo-contraparte-field.component';
import { TipoCuentaFieldComponent } from './tipo-cuenta-field/tipo-cuenta-field.component';
import { TipoDocumentoFieldComponent } from './tipo-documento-field/tipo-documento-field.component';
import { TipoInstrumentoViaBancoFieldComponent } from './tipo-instrumento-via-banco-field/tipo-instrumento-via-banco-field.component';
import { TipoInsumoByFleteFieldComponent } from './tipo-insumo-by-flete-field/tipo-insumo-by-flete-field.component';
import { TipoIvaFieldComponent } from './tipo-iva-field/tipo-iva-field.component';
import { TipoMovimientoDialogFieldComponent } from './tipo-movimiento-dialog-field/tipo-movimiento-dialog-field.component';
import { TipoPersonaFieldComponent } from './tipo-persona-field/tipo-persona-field.component';
import { TipoRegistroFieldComponent } from './tipo-registro-field/tipo-registro-field.component';
import { TipoSemiFieldComponent } from './tipo-semi-field/tipo-semi-field.component';
import { UnidadFieldComponent } from './unidad-field/unidad-field.component';
import { CombinacionReadonlyByIdDialogFieldComponent } from './combinacion-readonly-by-id-dialog-field/combinacion-readonly-by-id-dialog-field.component';
import { CamionByPropietarioDialogFieldComponent } from './camion-by-propietario-dialog-field/camion-by-propietario-dialog-field.component';
import { SemiByPropietarioDialogFieldComponent } from './semi-by-propietario-dialog-field/semi-by-propietario-dialog-field.component';
import { ChoferByPropietarioDialogFieldComponent } from './chofer-by-propietario-dialog-field/chofer-by-propietario-dialog-field.component';
import { TipoPersonaByBeneficiarioDialogFieldComponent } from './tipo-persona-by-beneficiario-dialog-field/tipo-persona-by-beneficiario-dialog-field.component';
import { TipoPersonaByPropietarioFieldComponent } from './tipo-persona-by-propietario-field/tipo-persona-by-propietario-field.component';
import { InputFieldByPlacaComponent } from './input-field-by-placa/input-field-by-placa.component';
import { DialogFieldPlacaComponent } from './dialog-field-placa/dialog-field-placa.component';
import { InputFieldNetoComponent } from './input-field-neto/input-field-neto.component';
import { PropietarioByTipoPersonaMapDialogFieldComponent } from './propietario-by-tipo-persona-map-dialog-field/propietario-by-tipo-persona-map-dialog-field.component';
import { CiudadMapDialogFieldComponent } from './ciudad-map-dialog-field/ciudad-map-dialog-field.component';
import { DialogMapFieldComponent } from './dialog-map-field/dialog-map-field.component';
import { InputFieldOcComponent } from './input-field-oc/input-field-oc.component';
import { DialogFieldOcComponent } from './dialog-field-oc/dialog-field-oc.component';
import { CombinacionDialogFieldComponent } from './combinacion-dialog-field/combinacion-dialog-field.component';
import { OcByCombinacionDialogFieldComponent } from './oc-by-combinacion-dialog-field/oc-by-combinacion-dialog-field.component';


const modules = [
  AliasFieldComponent,
  BancoByGestorDialogFieldComponent,
  CajaByGestorDialogFieldComponent,
  CamionByGestorFieldComponent,
  CamionByProductoDialogFieldComponent,
  CamionByPropietarioDialogFieldComponent,
  CargoFieldComponent,
  CentroOperativoByGestorDialogFieldComponent,
  CentroOperativoByGestorMapDialogFieldComponent,
  CentroOperativoFieldComponent,
  CombinacionReadonlyByIdDialogFieldComponent,
  ChoferByCamionDialogFieldComponent,
  ChoferFieldComponent,
  ChoferByPropietarioDialogFieldComponent,
  CiudadDialogFieldComponent,
  CiudadMapDialogFieldComponent,
  CiudadFieldComponent,
  CombinacionDialogFieldComponent,
  ColorFieldComponent,
  ContraparteByTipoDialogFieldComponent,
  ContraparteFieldComponent,
  DialogFieldComponent,
  InputFieldByPlacaComponent,
  DialogFormFieldControlComponent,
  DigitoVerificadorFieldComponent,
  EmailFieldComponent,
  EnteEmisorAutomotorFieldComponent,
  EnteEmisorTransporteFieldComponent,
  EstadoFieldComponent,
  FechaFieldComponent,
  FileFieldComponent,
  FleteByGestorDialogFieldComponent,
  GenericListFieldComponent,
  GestorCargaDialogFieldComponent,
  InputFieldComponent,
  InputFieldOcComponent,
  InstrumentoViaFieldComponent,
  InsumoByTipoFieldComponent,
  InsumoPuntoVentaPrecioMapDialogFieldComponent,
  LocalidadFieldComponent,
  MarcaCamionFieldComponent,
  MarcaSemiFieldComponent,
  MonedaByInsumoPuntoVentaFieldComponent,
  MonedaFieldComponent,
  NumberFieldComponent,
  OficialCuentaFieldComponent,
  OrdenCargaRemisionOrigenFieldComponent,
  PaisFieldComponent,
  PasswordFieldComponent,
  PermisoFieldComponent,
  PermisoFormFieldControlComponent,
  ProductoByGestorDialogFieldComponent,
  ProductoFieldComponent,
  PropietarioFieldComponent,
  PropietarioReadonlyByIdDialogFieldComponent,
  PropietarioByTipoPersonaMapDialogFieldComponent,
  InputFieldNetoComponent,
  ProveedorByInsumoFieldComponent,
  ProveedorFieldComponent,
  PuntoVentaByInsumoProveedorFieldComponent,
  PuntoVentaByProveedorFieldComponent,
  PuntoVentaMapDialogFieldComponent,
  RemitenteByGestorMapDialogFieldComponent,
  RemitenteFieldComponent,
  RolFieldComponent,
  RolFormFieldControlComponent,
  SemiByCamionProductoDialogFieldComponent,
  SemiByGestorDialogFieldComponent,
  SemiByPropietarioDialogFieldComponent,
  SemiClasificacionFieldComponent,
  SlideComponent,
  TelefonoFieldComponent,
  TipoAnticipoByFleteFieldComponent,
  TipoAnticipoFieldComponent,
  TipoCamionFieldComponent,
  TipoCargaFieldComponent,
  TipoComprobanteFieldComponent,
  TipoConceptoComplementoFieldComponent,
  TipoConceptoDescuentoFieldComponent,
  TipoContraparteFieldComponent,
  TipoCuentaFieldComponent,
  TipoDocumentoFieldComponent,
  TipoInstrumentoViaBancoFieldComponent,
  TipoInsumoByFleteFieldComponent,
  TipoIvaFieldComponent,
  TipoMovimientoDialogFieldComponent,
  TipoPersonaFieldComponent,
  TipoPersonaByPropietarioFieldComponent,
  TipoRegistroFieldComponent,
  TipoPersonaByBeneficiarioDialogFieldComponent,
  TipoSemiFieldComponent,
  UnidadFieldComponent,
  OcByCombinacionDialogFieldComponent
];

@NgModule({
  declarations: [...modules.slice(), AccionPipe, CombinacionReadonlyByIdDialogFieldComponent, CamionByPropietarioDialogFieldComponent, SemiByPropietarioDialogFieldComponent, ChoferByPropietarioDialogFieldComponent, TipoPersonaByBeneficiarioDialogFieldComponent, TipoPersonaByPropietarioFieldComponent, InputFieldByPlacaComponent, DialogFieldPlacaComponent, InputFieldNetoComponent, PropietarioByTipoPersonaMapDialogFieldComponent, CiudadMapDialogFieldComponent, DialogMapFieldComponent, InputFieldOcComponent, DialogFieldOcComponent, CombinacionDialogFieldComponent, OcByCombinacionDialogFieldComponent],
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
