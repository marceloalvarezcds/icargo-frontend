import { EstadoEnum } from '../enums/estado-enum';
import {
  PuntoVentaContactoGestorCargaList,
  mockPuntoVentaContactoGestorCargaList,
} from './punto-venta-contacto-gestor-carga';
import {
  Ciudad,
  mockCiudadArgentina,
  mockCiudadBrasil,
  mockCiudadParaguay,
} from './ciudad';
import {
  ComposicionJuridica,
  mockComposicionJuridicaList,
} from './composicion-juridica';
import {
  GestorCargaPuntoVenta,
  mockGestorCargaPuntoVentaList,
} from './gestor-carga-punto-venta';
import { mockTipoDocumentoList, TipoDocumento } from './tipo-documento';
import { mockProveedorList } from './proveedor';

export interface PuntoVenta {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  numero_sucursal: number,
  proveedor_id: number;
  proveedor_nombre: string;
  tipo_documento_id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  digito_verificador: string;
  composicion_juridica_id: number | null;
  composicion_juridica: ComposicionJuridica | null;
  logo?: string | null;
  estado: EstadoEnum;
  puede_recibir_anticipos_efectivo: boolean,
  telefono: string;
  email?: string | null;
  pagina_web?: string | null;
  info_complementaria?: string | null;
  direccion?: string | null;
  latitud: number | null;
  longitud: number | null;
  ciudad_id: number | null;
  ciudad: Ciudad | null;
  contactos: PuntoVentaContactoGestorCargaList[];
  gestor_carga_punto_venta?: GestorCargaPuntoVenta;
  modified_by: string;
}

const gestorCargaPuntoVenta0 = mockGestorCargaPuntoVentaList[0];

const tipoDocumento0 = mockTipoDocumentoList[0];
const tipoDocumento1 = mockTipoDocumentoList[1];
const tipoDocumento2 = mockTipoDocumentoList[2];
const composicionJuridica0 = mockComposicionJuridicaList[0];
const composicionJuridica1 = mockComposicionJuridicaList[1];
const composicionJuridica2 = mockComposicionJuridicaList[2];

export interface PuntoVentaList extends PuntoVenta {
  composicion_juridica_nombre: string | null;
  ciudad_nombre: string | null;
  localidad_nombre: string | null;
  pais_nombre: string | null;
  pais_nombre_corto: string | null;
  tipo_documento_descripcion: string;
  created_by: string;
  puede_recibir_anticipos_efectivo: boolean;
}


export const mockPuntoVentaList: PuntoVentaList[] = []
/*  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    nombre_corto: 'cargill',
    proveedor_id: mockProveedorList[0].id,
    proveedor_nombre: mockProveedorList[0].nombre,
    tipo_documento_id: tipoDocumento0.id,
    tipo_documento: tipoDocumento0,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica0.id,
    composicion_juridica: composicionJuridica0,
    logo: 'http://localhost:8103/api/bura26.png',
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    pagina_web: 'cargill-cedrales.com',
    info_complementaria: null,
    direccion: 'CEDRALES',
    latitud: -25.658948139894708,
    longitud: -54.717514329980474,
    ciudad_id: 13,
    ciudad: mockCiudadParaguay,
    contactos: mockPuntoVentaContactoGestorCargaList.slice(),
    gestor_carga_punto_venta: gestorCargaPuntoVenta0,
    composicion_juridica_nombre: composicionJuridica0.nombre,
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento0.descripcion,
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    nombre_corto: null,
    proveedor_id: mockProveedorList[1].id,
    proveedor_nombre: mockProveedorList[1].nombre,
    tipo_documento_id: tipoDocumento1.id,
    tipo_documento: tipoDocumento1,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica1.id,
    composicion_juridica: composicionJuridica1,
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    pagina_web: 'adm-santa-rita.com',
    info_complementaria: null,
    direccion: 'SANTA RITA',
    latitud: -25.7917136,
    longitud: -55.08793379999997,
    ciudad_id: 7,
    ciudad: mockCiudadArgentina,
    contactos: [],
    composicion_juridica_nombre: composicionJuridica1.nombre,
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento1.descripcion,
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    nombre_corto: null,
    proveedor_id: mockProveedorList[2].id,
    proveedor_nombre: mockProveedorList[2].nombre,
    tipo_documento_id: tipoDocumento2.id,
    tipo_documento: tipoDocumento2,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica2.id,
    composicion_juridica: composicionJuridica2,
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    pagina_web: 'gical-km12.com',
    info_complementaria: null,
    direccion: 'GICAL KM 12',
    latitud: -25.4921592,
    longitud: -54.72833349999996,
    ciudad_id: 400,
    ciudad: mockCiudadBrasil,
    contactos: [],
    gestor_carga_punto_venta: undefined,
    composicion_juridica_nombre: composicionJuridica2.nombre,
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    tipo_documento_descripcion: tipoDocumento2.descripcion,
  },
];
*/
