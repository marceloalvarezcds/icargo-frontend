import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoFleteEnum } from 'src/app/enums/tipo-flete-enum';
import { CentroOperativo, mockCentroOperativoList } from './centro-operativo';
import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';
import { FleteComplemento, mockFleteComplementoList } from './flete-complemento';
import { FleteDescuento, mockFleteDescuentoList } from './flete-descuento';
import { FleteDestinatario, mockFleteDestinatarioList } from './flete-destinatario';
import { mockGestorCargaList } from './gestor-carga';
import { mockMonedaList, Moneda } from './moneda';
import { mockProductoList, Producto } from './producto';
import { mockRemitenteList, Remitente } from './remitente';
import { mockTipoCargaList, TipoCarga } from './tipo-carga';
import { mockUnidadList, Unidad } from './unidad';

export interface FleteFormBaseModel {
  remitente_id: number;
  producto_id: number;
  tipo_carga_id: number;
  numero_lote?: string | null;
  publicado: boolean;
  publicado_descripcion: string;
  es_subasta: boolean;
  // INICIO Tramo de Fletes
  origen_id: number;
  origen_indicacion?: string | null;
  destino_id: number;
  destino_indicacion?: string | null;
  distancia?: number | null;
  // FIN Tramo de Fletes
  // INICIO Cantidad y Flete
  condicion_cantidad: number;
  // inicio - Condiciones para el Gestor de Cuenta
  condicion_gestor_cuenta_moneda_id: number;
  condicion_gestor_cuenta_tarifa: number;
  condicion_gestor_cuenta_unidad_id: number;
  // fin - Condiciones para el Gestor de Cuenta
  // inicio - Condiciones para el Propietario
  condicion_propietario_moneda_id: number;
  condicion_propietario_tarifa: number;
  condicion_propietario_unidad_id: number;
  // fin - Condiciones para el Propietario
  // FIN Cantidad y Flete
  // INICIO Mermas de Fletes
  // inicio - Mermas para el Gestor de Cuenta
  merma_gestor_cuenta_valor: number;
  merma_gestor_cuenta_moneda_id: number;
  merma_gestor_cuenta_unidad_id: number;
  merma_gestor_cuenta_es_porcentual: boolean;
  merma_gestor_cuenta_tolerancia: number;
  // fin - Mermas para el Gestor de Cuenta
  // inicio - Mermas para el Propietario
  merma_propietario_valor: number;
  merma_propietario_moneda_id: number;
  merma_propietario_unidad_id: number;
  merma_propietario_es_porcentual: boolean;
  merma_propietario_tolerancia: number;
  // fin - Mermas para el Propietario
  // FIN Mermas de Fletes
  vigencia_anticipos: string;
  // INICIO Emisión de Órdenes
  emision_orden_texto_legal: string;
  emision_orden_detalle: string;
  // FIN Emisión de Órdenes
  tipo_flete: TipoFleteEnum;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface Flete extends FleteFormBaseModel {
  id: number;
  remitente: Remitente;
  producto: Producto;
  tipo_carga: TipoCarga
  estado: EstadoEnum;
  gestor_cuenta_id: number;
  // INICIO Tramo de Fletes
  origen: CentroOperativo;
  destino: CentroOperativo;
  // FIN Tramo de Fletes
  // INICIO Cantidad y Flete
  // inicio - Condiciones para el Gestor de Cuenta
  condicion_gestor_cuenta_moneda: Moneda;
  condicion_gestor_cuenta_unidad: Unidad;
  // fin - Condiciones para el Gestor de Cuenta
  // inicio - Condiciones para el Propietario
  condicion_propietario_moneda: Moneda;
  condicion_propietario_unidad: Unidad;
  // fin - Condiciones para el Propietario
  // FIN Cantidad y Flete
  // INICIO Mermas de Fletes
  // inicio - Mermas para el Gestor de Cuenta
  merma_gestor_cuenta_moneda: Moneda;
  merma_gestor_cuenta_unidad: Unidad;
  // fin - Mermas para el Gestor de Cuenta
  // inicio - Mermas para el Propietario
  merma_propietario_moneda: Moneda;
  merma_propietario_unidad: Unidad;
  // fin - Mermas para el Propietario
  // FIN Mermas de Fletes
  // INICIO Emisión de Órdenes
  destinatarios: FleteDestinatario[]
  // FIN Emisión de Órdenes
  anticipos: FleteAnticipo[]
  complementos: FleteComplemento[]
  descuentos: FleteDescuento[]
}

export interface FleteList extends FleteFormBaseModel {
  id: number;
  remitente_nombre: string;
  producto_descripcion: string;
  tipo_carga_descripcion: string;
  estado: EstadoEnum
  gestor_cuenta_nombre: string;
  // INICIO Tramo de Fletes
  origen_nombre: string;
  destino_nombre: string;
  // FIN Tramo de Fletes
  // INICIO Cantidad y Flete
  // inicio - Condiciones para el Gestor de Cuenta
  condicion_gestor_cuenta_moneda_nombre: string;
  condicion_gestor_cuenta_unidad_descripcion: string;
  // fin - Condiciones para el Gestor de Cuenta
  // inicio - Condiciones para el Propietario
  condicion_propietario_moneda_nombre: string;
  condicion_propietario_unidad_descripcion: string;
  // fin - Condiciones para el Propietario
  // FIN Cantidad y Flete
  // INICIO Mermas de Fletes
  // inicio - Mermas para el Gestor de Cuenta
  merma_gestor_cuenta_moneda_nombre: string;
  merma_gestor_cuenta_unidad_descripcion: string;
  // fin - Mermas para el Gestor de Cuenta
  // inicio - Mermas para el Propietario
  merma_propietario_moneda_nombre: string;
  merma_propietario_unidad_descripcion: string;
  // fin - Mermas para el Propietario
  // FIN Mermas de Fletes
}

const gestor0 = mockGestorCargaList[0];
const gestor1 = mockGestorCargaList[1];

const destino1 = mockCentroOperativoList[0];
const destino2 = mockCentroOperativoList[1];
const destino3 = mockCentroOperativoList[2];
const origen1 = mockCentroOperativoList[0];
const origen2 = mockCentroOperativoList[1];
const origen3 = mockCentroOperativoList[2];
const remitente1 = mockRemitenteList[0];
const remitente2 = mockRemitenteList[1];
const remitente3 = mockRemitenteList[2];

const pyg = mockMonedaList[0];
const usd = mockMonedaList[1];
const brl = mockMonedaList[2];

const trigo = mockProductoList[0];
const soja = mockProductoList[1];
const fertilizante = mockProductoList[2];

const seca = mockTipoCargaList[0];
const liquida = mockTipoCargaList[1];

const toneladas = mockUnidadList[0];
const kilogramos = mockUnidadList[0];
const litros = mockUnidadList[0];

export const mockFlete1: Flete = {
  id: 1,
  remitente_id: remitente1.id,
  remitente: remitente1,
  producto_id: trigo.id,
  producto: trigo,
  tipo_carga_id: seca.id,
  tipo_carga: seca,
  numero_lote: '1000000',
  publicado: true,
  publicado_descripcion: 'Si',
  es_subasta: true,
  estado: EstadoEnum.ACTIVO,
  gestor_cuenta_id: gestor0.id,
  // INICIO Tramo de Fletes
  origen_id: origen2.id,
  origen: origen2,
  origen_indicacion: 'Origen Indicaciones',
  destino_id: destino3.id,
  destino: destino3,
  destino_indicacion: 'Destino Indicaciones',
  distancia: 100,
  // FIN Tramo de Fletes
  // INICIO Cantidad y Flete
  condicion_cantidad: 100,
  // inicio - Condiciones para el Gestor de Cuenta
  condicion_gestor_cuenta_moneda_id: pyg.id,
  condicion_gestor_cuenta_moneda: pyg,
  condicion_gestor_cuenta_tarifa: 100,
  condicion_gestor_cuenta_unidad_id: toneladas.id,
  condicion_gestor_cuenta_unidad: toneladas,
  // fin - Condiciones para el Gestor de Cuenta
  // inicio - Condiciones para el Propietario
  condicion_propietario_moneda_id: pyg.id,
  condicion_propietario_moneda: pyg,
  condicion_propietario_tarifa: 100,
  condicion_propietario_unidad_id: toneladas.id,
  condicion_propietario_unidad: toneladas,
  // fin - Condiciones para el Propietario
  // FIN Cantidad y Flete
  // INICIO Mermas de Fletes
  // inicio - Mermas para el Gestor de Cuenta
  merma_gestor_cuenta_valor: 100,
  merma_gestor_cuenta_moneda_id: pyg.id,
  merma_gestor_cuenta_moneda: pyg,
  merma_gestor_cuenta_unidad_id: toneladas.id,
  merma_gestor_cuenta_unidad: toneladas,
  merma_gestor_cuenta_es_porcentual: true,
  merma_gestor_cuenta_tolerancia: 100,
  // fin - Mermas para el Gestor de Cuenta
  // inicio - Mermas para el Propietario
  merma_propietario_valor: 100,
  merma_propietario_moneda_id: pyg.id,
  merma_propietario_moneda: pyg,
  merma_propietario_unidad_id: toneladas.id,
  merma_propietario_unidad: toneladas,
  merma_propietario_es_porcentual: true,
  merma_propietario_tolerancia: 100,
  // fin - Mermas para el Propietario
  // FIN Mermas de Fletes
  vigencia_anticipos: '2021-11-30T20:38:09.553757',
  // INICIO Emisión de Órdenes
  emision_orden_texto_legal: 'Emisión de Órdenes - Texto Legal 1',
  emision_orden_detalle: 'Emisión de Órdenes - Detalle 1',
  destinatarios: mockFleteDestinatarioList,
  // FIN Emisión de Órdenes
  tipo_flete: TipoFleteEnum.DOMESTICO,
  anticipos: mockFleteAnticipoList,
  complementos: mockFleteComplementoList,
  descuentos: mockFleteDescuentoList,
  created_by: 'system',
  created_at: '2021-11-30T20:38:09.553757',
  modified_by: 'system',
  modified_at: '2021-11-30T20:38:09.553757',
};

export const mockFlete2: Flete = {
  id: 2,
  remitente_id: remitente2.id,
  remitente: remitente2,
  producto_id: soja.id,
  producto: soja,
  tipo_carga_id: liquida.id,
  tipo_carga: liquida,
  numero_lote: '2000000',
  publicado: true,
  publicado_descripcion: 'Si',
  es_subasta: true,
  estado: EstadoEnum.ACTIVO,
  gestor_cuenta_id: gestor1.id,
  // INICIO Tramo de Fletes
  origen_id: origen3.id,
  origen: origen3,
  origen_indicacion: 'Origen Indicaciones',
  destino_id: destino1.id,
  destino: destino1,
  destino_indicacion: 'Destino Indicaciones',
  distancia: 100,
  // FIN Tramo de Fletes
  // INICIO Cantidad y Flete
  condicion_cantidad: 100,
  // inicio - Condiciones para el Gestor de Cuenta
  condicion_gestor_cuenta_moneda_id: usd.id,
  condicion_gestor_cuenta_moneda: usd,
  condicion_gestor_cuenta_tarifa: 100,
  condicion_gestor_cuenta_unidad_id: kilogramos.id,
  condicion_gestor_cuenta_unidad: kilogramos,
  // fin - Condiciones para el Gestor de Cuenta
  // inicio - Condiciones para el Propietario
  condicion_propietario_moneda_id: usd.id,
  condicion_propietario_moneda: usd,
  condicion_propietario_tarifa: 100,
  condicion_propietario_unidad_id: kilogramos.id,
  condicion_propietario_unidad: kilogramos,
  // fin - Condiciones para el Propietario
  // FIN Cantidad y Flete
  // INICIO Mermas de Fletes
  // inicio - Mermas para el Gestor de Cuenta
  merma_gestor_cuenta_valor: 100,
  merma_gestor_cuenta_moneda_id: usd.id,
  merma_gestor_cuenta_moneda: usd,
  merma_gestor_cuenta_unidad_id: kilogramos.id,
  merma_gestor_cuenta_unidad: kilogramos,
  merma_gestor_cuenta_es_porcentual: true,
  merma_gestor_cuenta_tolerancia: 100,
  // fin - Mermas para el Gestor de Cuenta
  // inicio - Mermas para el Propietario
  merma_propietario_valor: 100,
  merma_propietario_moneda_id: usd.id,
  merma_propietario_moneda: usd,
  merma_propietario_unidad_id: kilogramos.id,
  merma_propietario_unidad: kilogramos,
  merma_propietario_es_porcentual: true,
  merma_propietario_tolerancia: 100,
  // fin - Mermas para el Propietario
  // FIN Mermas de Fletes
  vigencia_anticipos: '2021-11-30T20:38:09.553757',
  // INICIO Emisión de Órdenes
  emision_orden_texto_legal: 'Emisión de Órdenes - Texto Legal 1',
  emision_orden_detalle: 'Emisión de Órdenes - Detalle 1',
  destinatarios: mockFleteDestinatarioList,
  // FIN Emisión de Órdenes
  tipo_flete: TipoFleteEnum.DOMESTICO,
  anticipos: mockFleteAnticipoList,
  complementos: mockFleteComplementoList,
  descuentos: mockFleteDescuentoList,
  created_by: 'system',
  created_at: '2021-11-30T20:38:09.553757',
  modified_by: 'system',
  modified_at: '2021-11-30T20:38:09.553757',
};

export const mockFleteList: FleteList[] = [
  {
    id: 1,
    remitente_id: remitente1.id,
    remitente_nombre: remitente1.nombre,
    producto_id: trigo.id,
    producto_descripcion: trigo.descripcion,
    tipo_carga_id: seca.id,
    tipo_carga_descripcion: seca.descripcion,
    numero_lote: '1000000',
    publicado: true,
    publicado_descripcion: 'Si',
    es_subasta: false,
    estado: EstadoEnum.ACTIVO,
    gestor_cuenta_nombre: gestor0.nombre,
    // INICIO Tramo de Fletes
    origen_id: origen2.id,
    origen_nombre: origen2.nombre,
    origen_indicacion: 'Origen Indicaciones',
    destino_id: destino3.id,
    destino_nombre: destino3.nombre,
    destino_indicacion: 'Destino Indicaciones',
    distancia: 100,
    // FIN Tramo de Fletes
    // INICIO Cantidad y Flete
    condicion_cantidad: 100,
    // inicio - Condiciones para el Gestor de Cuenta
    condicion_gestor_cuenta_moneda_id: pyg.id,
    condicion_gestor_cuenta_moneda_nombre: pyg.nombre,
    condicion_gestor_cuenta_tarifa: 100,
    condicion_gestor_cuenta_unidad_id: toneladas.id,
    condicion_gestor_cuenta_unidad_descripcion: toneladas.descripcion,
    // fin - Condiciones para el Gestor de Cuenta
    // inicio - Condiciones para el Propietario
    condicion_propietario_moneda_id: pyg.id,
    condicion_propietario_moneda_nombre: pyg.nombre,
    condicion_propietario_tarifa: 100,
    condicion_propietario_unidad_id: toneladas.id,
    condicion_propietario_unidad_descripcion: toneladas.descripcion,
    // fin - Condiciones para el Propietario
    // FIN Cantidad y Flete
    // INICIO Mermas de Fletes
    // inicio - Mermas para el Gestor de Cuenta
    merma_gestor_cuenta_valor: 100,
    merma_gestor_cuenta_moneda_id: pyg.id,
    merma_gestor_cuenta_moneda_nombre: pyg.nombre,
    merma_gestor_cuenta_unidad_id: toneladas.id,
    merma_gestor_cuenta_unidad_descripcion: toneladas.descripcion,
    merma_gestor_cuenta_es_porcentual: true,
    merma_gestor_cuenta_tolerancia: 100,
    // fin - Mermas para el Gestor de Cuenta
    // inicio - Mermas para el Propietario
    merma_propietario_valor: 100,
    merma_propietario_moneda_id: pyg.id,
    merma_propietario_moneda_nombre: pyg.nombre,
    merma_propietario_unidad_id: toneladas.id,
    merma_propietario_unidad_descripcion: toneladas.descripcion,
    merma_propietario_es_porcentual: true,
    merma_propietario_tolerancia: 100,
    // fin - Mermas para el Propietario
    // FIN Mermas de Fletes
    vigencia_anticipos: '2021-11-30T20:38:09.553757',
    // INICIO Emisión de Órdenes
    emision_orden_texto_legal: 'Emisión de Órdenes - Texto Legal 1',
    emision_orden_detalle: 'Emisión de Órdenes - Detalle 1',
    // FIN Emisión de Órdenes
    tipo_flete: TipoFleteEnum.DOMESTICO,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    remitente_id: remitente2.id,
    remitente_nombre: remitente2.nombre,
    producto_id: soja.id,
    producto_descripcion: soja.descripcion,
    tipo_carga_id: liquida.id,
    tipo_carga_descripcion: liquida.descripcion,
    numero_lote: '2000000',
    publicado: false,
    publicado_descripcion: 'No',
    es_subasta: false,
    estado: EstadoEnum.CANCELADO,
    gestor_cuenta_nombre: gestor0.nombre,
    // INICIO Tramo de Fletes
    origen_id: origen3.id,
    origen_nombre: origen3.nombre,
    origen_indicacion: 'Origen Indicaciones',
    destino_id: destino1.id,
    destino_nombre: destino1.nombre,
    destino_indicacion: 'Destino Indicaciones',
    distancia: 100,
    // FIN Tramo de Fletes
    // INICIO Cantidad y Flete
    condicion_cantidad: 100,
    // inicio - Condiciones para el Gestor de Cuenta
    condicion_gestor_cuenta_moneda_id: usd.id,
    condicion_gestor_cuenta_moneda_nombre: usd.nombre,
    condicion_gestor_cuenta_tarifa: 100,
    condicion_gestor_cuenta_unidad_id: kilogramos.id,
    condicion_gestor_cuenta_unidad_descripcion: kilogramos.descripcion,
    // fin - Condiciones para el Gestor de Cuenta
    // inicio - Condiciones para el Propietario
    condicion_propietario_moneda_id: usd.id,
    condicion_propietario_moneda_nombre: usd.nombre,
    condicion_propietario_tarifa: 100,
    condicion_propietario_unidad_id: kilogramos.id,
    condicion_propietario_unidad_descripcion: kilogramos.descripcion,
    // fin - Condiciones para el Propietario
    // FIN Cantidad y Flete
    // INICIO Mermas de Fletes
    // inicio - Mermas para el Gestor de Cuenta
    merma_gestor_cuenta_valor: 100,
    merma_gestor_cuenta_moneda_id: usd.id,
    merma_gestor_cuenta_moneda_nombre: usd.nombre,
    merma_gestor_cuenta_unidad_id: kilogramos.id,
    merma_gestor_cuenta_unidad_descripcion: kilogramos.descripcion,
    merma_gestor_cuenta_es_porcentual: true,
    merma_gestor_cuenta_tolerancia: 100,
    // fin - Mermas para el Gestor de Cuenta
    // inicio - Mermas para el Propietario
    merma_propietario_valor: 100,
    merma_propietario_moneda_id: usd.id,
    merma_propietario_moneda_nombre: usd.nombre,
    merma_propietario_unidad_id: kilogramos.id,
    merma_propietario_unidad_descripcion: kilogramos.descripcion,
    merma_propietario_es_porcentual: true,
    merma_propietario_tolerancia: 100,
    // fin - Mermas para el Propietario
    // FIN Mermas de Fletes
    vigencia_anticipos: '2021-11-30T20:38:09.553757',
    // INICIO Emisión de Órdenes
    emision_orden_texto_legal: 'Emisión de Órdenes - Texto Legal 2',
    emision_orden_detalle: 'Emisión de Órdenes - Detalle 2',
    // FIN Emisión de Órdenes
    tipo_flete: TipoFleteEnum.DOMESTICO,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    remitente_id: remitente3.id,
    remitente_nombre: remitente3.nombre,
    producto_id: fertilizante.id,
    producto_descripcion: fertilizante.descripcion,
    tipo_carga_id: seca.id,
    tipo_carga_descripcion: seca.descripcion,
    numero_lote: '3000000',
    publicado: true,
    publicado_descripcion: 'Si',
    es_subasta: true,
    estado: EstadoEnum.ACTIVO,
    gestor_cuenta_nombre: gestor1.nombre,
    // INICIO Tramo de Fletes
    origen_id: origen1.id,
    origen_nombre: origen1.nombre,
    origen_indicacion: 'Origen Indicaciones',
    destino_id: destino2.id,
    destino_nombre: destino2.nombre,
    destino_indicacion: 'Destino Indicaciones',
    distancia: 100,
    // FIN Tramo de Fletes
    // INICIO Cantidad y Flete
    condicion_cantidad: 100,
    // inicio - Condiciones para el Gestor de Cuenta
    condicion_gestor_cuenta_moneda_id: brl.id,
    condicion_gestor_cuenta_moneda_nombre: brl.nombre,
    condicion_gestor_cuenta_tarifa: 100,
    condicion_gestor_cuenta_unidad_id: litros.id,
    condicion_gestor_cuenta_unidad_descripcion: litros.descripcion,
    // fin - Condiciones para el Gestor de Cuenta
    // inicio - Condiciones para el Propietario
    condicion_propietario_moneda_id: brl.id,
    condicion_propietario_moneda_nombre: brl.nombre,
    condicion_propietario_tarifa: 100,
    condicion_propietario_unidad_id: litros.id,
    condicion_propietario_unidad_descripcion: litros.descripcion,
    // fin - Condiciones para el Propietario
    // FIN Cantidad y Flete
    // INICIO Mermas de Fletes
    // inicio - Mermas para el Gestor de Cuenta
    merma_gestor_cuenta_valor: 100,
    merma_gestor_cuenta_moneda_id: brl.id,
    merma_gestor_cuenta_moneda_nombre: brl.nombre,
    merma_gestor_cuenta_unidad_id: litros.id,
    merma_gestor_cuenta_unidad_descripcion: litros.descripcion,
    merma_gestor_cuenta_es_porcentual: true,
    merma_gestor_cuenta_tolerancia: 100,
    // fin - Mermas para el Gestor de Cuenta
    // inicio - Mermas para el Propietario
    merma_propietario_valor: 100,
    merma_propietario_moneda_id: brl.id,
    merma_propietario_moneda_nombre: brl.nombre,
    merma_propietario_unidad_id: litros.id,
    merma_propietario_unidad_descripcion: litros.descripcion,
    merma_propietario_es_porcentual: true,
    merma_propietario_tolerancia: 100,
    // fin - Mermas para el Propietario
    // FIN Mermas de Fletes
    vigencia_anticipos: '2021-11-30T20:38:09.553757',
    // INICIO Emisión de Órdenes
    emision_orden_texto_legal: 'Emisión de Órdenes - Texto Legal 3',
    emision_orden_detalle: 'Emisión de Órdenes - Detalle 3',
    // FIN Emisión de Órdenes
    tipo_flete: TipoFleteEnum.DOMESTICO,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
