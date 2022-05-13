import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Ciudad, mockCiudadList } from './ciudad';
import { Color, mockColorList } from './color';
import {
  EnteEmisorAutomotor,
  mockEnteEmisorAutomotorList,
} from './ente-emisor-automotor';
import {
  EnteEmisorTransporte,
  mockEnteEmisorTransporteList,
} from './ente-emisor-transporte';
import { MarcaSemi, mockMarcaSemiList } from './marca-semi';
import { mockPaisList } from './pais';
import { mockPropietarioList, Propietario } from './propietario';
import {
  mockSemiClasificacionList,
  SemiClasificacion,
} from './semi-clasificacion';
import { mockTipoCargaList, TipoCarga } from './tipo-carga';
import { mockTipoSemiList, TipoSemi } from './tipo-semi';
import { mockUserAccount } from './user';

export interface Semi {
  id: number;
  placa: string;
  propietario_id: number;
  propietario: Propietario;
  numero_chasis: string | null;
  foto: string | null;
  estado: EstadoEnum;
  gestor_cuenta_id: number;
  info: string;
  // INICIO Habilitaciones del Camión
  // inicio - municipal
  ciudad_habilitacion_municipal_id: number;
  ciudad_habilitacion_municipal: Ciudad;
  numero_habilitacion_municipal: string;
  vencimiento_habilitacion_municipal: string;
  foto_habilitacion_municipal_frente: string | null;
  foto_habilitacion_municipal_reverso: string | null;
  // fin - municipal
  // inicio - transporte
  ente_emisor_transporte_id: number;
  ente_emisor_transporte: EnteEmisorTransporte;
  numero_habilitacion_transporte: string;
  vencimiento_habilitacion_transporte: string;
  foto_habilitacion_transporte_frente: string | null;
  foto_habilitacion_transporte_reverso: string | null;
  // fin - transporte
  // inicio - automotor
  ente_emisor_automotor_id: number;
  ente_emisor_automotor: EnteEmisorAutomotor;
  titular_habilitacion_automotor: string | null;
  foto_habilitacion_automotor_frente: string | null;
  foto_habilitacion_automotor_reverso: string | null;
  pais_emisor_placa_nombre: string;
  pais_emisor_placa_nombre_corto: string;
  // fin - automotor
  // FIN Habilitaciones del Camión
  // INICIO Detalles del Camión
  marca_id: number;
  marca: MarcaSemi;
  clasificacion_id: number;
  clasificacion: SemiClasificacion;
  tipo_id: number;
  tipo: TipoSemi;
  tipo_carga_id: number;
  tipo_carga: TipoCarga;
  color_id: number | null;
  color: Color | null;
  anho: number;
  // FIN Detalles del Camión
  // INICIO Capacidad del Camión
  bruto: number;
  tara: number;
  largo: number;
  alto: number;
  ancho: number;
  volumen: number;
  // FIN Capacidad del Camión
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface SemiList {
  id: number;
  placa: string;
  propietario_nombre: string;
  propietario_ruc: string;
  numero_chasis: string | null;
  estado: EstadoEnum;
  ciudad_habilitacion_municipal_nombre: string;
  gestor_cuenta_id: number;
  gestor_cuenta_nombre: string;
  localidad_habilitacion_municipal_nombre: string;
  info: string;
  marca_descripcion: string;
  clasificacion_descripcion: string;
  oficial_cuenta_nombre: string;
  pais_habilitacion_municipal_nombre: string;
  pais_habilitacion_municipal_nombre_corto: string;
  pais_emisor_placa_nombre: string;
  pais_emisor_placa_nombre_corto: string;
  tipo_descripcion: string;
  tipo_carga_descripcion: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

const color0 = mockColorList[0];
const ciudad0 = mockCiudadList[0];
const ciudad1 = mockCiudadList[1];
const clasificacion0 = mockSemiClasificacionList[0];
const clasificacion1 = mockSemiClasificacionList[1];
const enteEmisorAutomotor0 = mockEnteEmisorAutomotorList[0];
const enteEmisorTransporte0 = mockEnteEmisorTransporteList[0];
const marca0 = mockMarcaSemiList[0];
const marca1 = mockMarcaSemiList[1];
const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const placa0 = 'XXX111';
const placa1 = 'YYY111';
const propietario0 = mockPropietarioList[0];
const propietario1 = mockPropietarioList[1];
const tipoCarga0 = mockTipoCargaList[0];
const tipoCarga1 = mockTipoCargaList[1];
const tipoSemi0 = mockTipoSemiList[0];
const tipoSemi1 = mockTipoSemiList[1];
const info0 = `${placa0} - ${propietario0.nombre}`;
const info1 = `${placa1} - ${propietario1.nombre}`;

export const mockSemi: Semi = {
  id: 1,
  placa: placa0,
  propietario_id: propietario0.id,
  propietario: propietario0,
  numero_chasis: '23100100',
  foto: null,
  estado: EstadoEnum.ACTIVO,
  gestor_cuenta_id: 1,
  info: info0,
  // INICIO Habilitaciones del Camión
  // inicio - municipal
  ciudad_habilitacion_municipal_id: ciudad0.id,
  ciudad_habilitacion_municipal: ciudad0,
  numero_habilitacion_municipal: '33100100',
  vencimiento_habilitacion_municipal: '2023-06-01T00:00:00',
  foto_habilitacion_municipal_frente: null,
  foto_habilitacion_municipal_reverso: null,
  // fin - municipal
  // inicio - transporte
  ente_emisor_transporte_id: enteEmisorTransporte0.id,
  ente_emisor_transporte: enteEmisorTransporte0,
  numero_habilitacion_transporte: '43100100',
  vencimiento_habilitacion_transporte: '2024-06-01T00:00:00',
  foto_habilitacion_transporte_frente: null,
  foto_habilitacion_transporte_reverso: null,
  // fin - transporte
  // inicio - automotor
  ente_emisor_automotor_id: enteEmisorAutomotor0.id,
  ente_emisor_automotor: enteEmisorAutomotor0,
  titular_habilitacion_automotor: propietario0.nombre,
  foto_habilitacion_automotor_frente: null,
  foto_habilitacion_automotor_reverso: null,
  pais_emisor_placa_nombre: pais0.nombre,
  pais_emisor_placa_nombre_corto: pais0.nombre_corto,
  // fin - automotor
  // FIN Habilitaciones del Camión
  // INICIO Detalles del Camión
  marca_id: marca0.id,
  marca: marca0,
  clasificacion_id: clasificacion0.id,
  clasificacion: clasificacion0,
  tipo_id: tipoSemi0.id,
  tipo: tipoSemi0,
  tipo_carga_id: tipoCarga0.id,
  tipo_carga: tipoCarga0,
  color_id: color0.id,
  color: color0,
  anho: 2020,
  // FIN Detalles del Camión
  // INICIO Capacidad del Camión
  bruto: 1000,
  tara: 1000,
  largo: 1000,
  alto: 1000,
  ancho: 1000,
  volumen: 1000,
  // FIN Capacidad del Camión
  created_by: 'system',
  created_at: '2021-11-30T20:38:09.553757',
  modified_by: 'system',
  modified_at: '2021-11-30T20:38:09.553757',
};

export const mockSemiList: SemiList[] = [
  {
    id: 1,
    placa: placa0,
    propietario_nombre: propietario0.nombre,
    propietario_ruc: propietario0.ruc,
    numero_chasis: '23100100',
    estado: EstadoEnum.ACTIVO,
    ciudad_habilitacion_municipal_nombre: ciudad0.nombre,
    gestor_cuenta_id: mockUserAccount.id,
    gestor_cuenta_nombre: mockUserAccount.first_name,
    localidad_habilitacion_municipal_nombre: ciudad0.localidad.nombre,
    info: info0,
    marca_descripcion: marca0.descripcion,
    clasificacion_descripcion: clasificacion0.descripcion,
    oficial_cuenta_nombre: `${mockUserAccount.first_name} ${mockUserAccount.last_name}`,
    pais_habilitacion_municipal_nombre: ciudad0.localidad.pais.nombre,
    pais_habilitacion_municipal_nombre_corto:
      ciudad0.localidad.pais.nombre_corto,
    tipo_descripcion: tipoSemi0.descripcion,
    tipo_carga_descripcion: tipoCarga0.descripcion,
    pais_emisor_placa_nombre: pais0.nombre,
    pais_emisor_placa_nombre_corto: pais0.nombre_corto,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    placa: placa1,
    propietario_nombre: propietario1.nombre,
    propietario_ruc: propietario1.ruc,
    numero_chasis: '23100100',
    estado: EstadoEnum.ACTIVO,
    ciudad_habilitacion_municipal_nombre: ciudad1.nombre,
    gestor_cuenta_id: mockUserAccount.id,
    gestor_cuenta_nombre: mockUserAccount.first_name,
    localidad_habilitacion_municipal_nombre: ciudad1.localidad.nombre,
    info: info1,
    marca_descripcion: marca1.descripcion,
    clasificacion_descripcion: clasificacion1.descripcion,
    oficial_cuenta_nombre: `${mockUserAccount.first_name} ${mockUserAccount.last_name}`,
    pais_habilitacion_municipal_nombre: ciudad1.localidad.pais.nombre,
    pais_habilitacion_municipal_nombre_corto:
      ciudad1.localidad.pais.nombre_corto,
    tipo_descripcion: tipoSemi1.descripcion,
    tipo_carga_descripcion: tipoCarga1.descripcion,
    pais_emisor_placa_nombre: pais1.nombre,
    pais_emisor_placa_nombre_corto: pais1.nombre_corto,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
