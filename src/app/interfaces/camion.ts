import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Chofer, mockChoferList } from './chofer';
import { Ciudad, mockCiudadList } from './ciudad';
import { Color, mockColorList } from './color';
import { EnteEmisorAutomotor, mockEnteEmisorAutomotorList } from './ente-emisor-automotor';
import { EnteEmisorTransporte, mockEnteEmisorTransporteList } from './ente-emisor-transporte';
import { MarcaCamion, mockMarcaCamionList } from './marca-camion';
import { mockPaisList } from './pais';
import { mockPropietarioList, Propietario } from './propietario';
import { mockTipoCamionList, TipoCamion } from './tipo-camion';
import { mockUserAccount } from './user';

export interface Camion {
  id: number;
  placa: string;
  propietario_id: number;
  propietario: Propietario;
  chofer_id: number;
  chofer: Chofer;
  numero_chasis: string;
  foto: string | null;
  estado: EstadoEnum
  gestor_cuenta_id: number;
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
  marca: MarcaCamion;
  tipo_id: number;
  tipo: TipoCamion;
  color_id: number;
  color: Color;
  anho: number;
  // FIN Detalles del Camión
  // INICIO Capacidad del Camión
  bruto: number;
  tara: number;
  // FIN Capacidad del Camión
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface CamionList {
  id: number;
  placa: string;
  propietario_nombre: string;
  propietario_ruc: string;
  chofer_nombre: string;
  chofer_numero_documento: string;
  numero_chasis: string;
  estado: EstadoEnum
  ciudad_habilitacion_municipal_nombre: string;
  gestor_cuenta_id: number;
  gestor_cuenta_nombre: string;
  localidad_habilitacion_municipal_nombre: string;
  marca_descripcion: string;
  oficial_cuenta_nombre: string;
  pais_habilitacion_municipal_nombre: string;
  pais_habilitacion_municipal_nombre_corto: string;
  pais_emisor_placa_nombre: string;
  pais_emisor_placa_nombre_corto: string;
  tipo_descripcion: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

const color0 = mockColorList[0];
const chofer0 = mockChoferList[0];
const chofer1 = mockChoferList[1];
const ciudad0 = mockCiudadList[0];
const ciudad1 = mockCiudadList[1];
const enteEmisorAutomotor0 = mockEnteEmisorAutomotorList[0];
const enteEmisorTransporte0 = mockEnteEmisorTransporteList[0];
const marca0 = mockMarcaCamionList[0];
const marca1 = mockMarcaCamionList[1];
const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const propietario0 = mockPropietarioList[0];
const propietario1 = mockPropietarioList[1];
const tipoCamion0 = mockTipoCamionList[0];
const tipoCamion1 = mockTipoCamionList[1];

export const mockCamion: Camion = {
  id: 1,
  placa: 'XXX111',
  propietario_id: propietario0.id,
  propietario: propietario0,
  chofer_id: chofer0.id,
  chofer: chofer0,
  numero_chasis: '23100100',
  foto: null,
  estado: EstadoEnum.ACTIVO,
  gestor_cuenta_id: 1,
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
  tipo_id: tipoCamion0.id,
  tipo: tipoCamion0,
  color_id: color0.id,
  color: color0,
  anho: 2020,
  // FIN Detalles del Camión
  // INICIO Capacidad del Camión
  bruto: 1000,
  tara: 1000,
  // FIN Capacidad del Camión
  created_by: 'system',
  created_at: '2021-11-30T20:38:09.553757',
  modified_by: 'system',
  modified_at: '2021-11-30T20:38:09.553757',
}

export const mockCamionList: CamionList[] = [
  {
    id: 1,
    placa: 'XXX111',
    propietario_nombre: propietario0.nombre,
    propietario_ruc: propietario0.ruc,
    chofer_nombre: chofer0.nombre,
    chofer_numero_documento: chofer0.numero_documento,
    numero_chasis: '23100100',
    estado: EstadoEnum.ACTIVO,
    ciudad_habilitacion_municipal_nombre: ciudad0.nombre,
    gestor_cuenta_id: mockUserAccount.id,
    gestor_cuenta_nombre: mockUserAccount.first_name,
    localidad_habilitacion_municipal_nombre: ciudad0.localidad.nombre,
    marca_descripcion: marca0.descripcion,
    oficial_cuenta_nombre: `${mockUserAccount.first_name} ${mockUserAccount.last_name}`,
    pais_habilitacion_municipal_nombre: ciudad0.localidad.pais.nombre,
    pais_habilitacion_municipal_nombre_corto: ciudad0.localidad.pais.nombre_corto,
    tipo_descripcion: tipoCamion0.descripcion,
    pais_emisor_placa_nombre: pais0.nombre,
    pais_emisor_placa_nombre_corto: pais0.nombre_corto,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    placa: 'YYY111',
    propietario_nombre: propietario1.nombre,
    propietario_ruc: propietario1.ruc,
    chofer_nombre: chofer1.nombre,
    chofer_numero_documento: chofer1.numero_documento,
    numero_chasis: '23100100',
    estado: EstadoEnum.ACTIVO,
    ciudad_habilitacion_municipal_nombre: ciudad1.nombre,
    gestor_cuenta_id: mockUserAccount.id,
    gestor_cuenta_nombre: mockUserAccount.first_name,
    localidad_habilitacion_municipal_nombre: ciudad1.localidad.nombre,
    marca_descripcion: marca1.descripcion,
    oficial_cuenta_nombre: `${mockUserAccount.first_name} ${mockUserAccount.last_name}`,
    pais_habilitacion_municipal_nombre: ciudad1.localidad.pais.nombre,
    pais_habilitacion_municipal_nombre_corto: ciudad1.localidad.pais.nombre_corto,
    tipo_descripcion: tipoCamion1.descripcion,
    pais_emisor_placa_nombre: pais1.nombre,
    pais_emisor_placa_nombre_corto: pais1.nombre_corto,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
