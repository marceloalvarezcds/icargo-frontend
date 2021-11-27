import { EstadoEnum } from '../enums/estado-enum';
import { Chofer, mockChoferList } from './chofer';
import { MarcaCamion, mockMarcaCamionList } from './marca-camion';
import { mockPaisList, Pais } from './pais';
import { mockTipoCamionList, TipoCamion } from './tipo-camion';

export interface Camion {
  placa: string;
  estado: EstadoEnum;
  pais_emisor_id: number;
  pais_emisor: Pais;
  tipo_camion_id: number;
  tipo_camion: TipoCamion;
  chofer_id: number;
  chofer: Chofer,
  marca_id: number;
  marca: MarcaCamion;
}

export interface CamionList extends Camion {
  pais_emisor_nombre: string;
  tipo_camion_descripcion: string;
  chofer_numero_documento: string;
  chofer_nombre: string;
  marca_descripcion: string;
}

const chofer0 = mockChoferList[0];
const chofer1 = mockChoferList[1];
const marca0 = mockMarcaCamionList[0];
const marca1 = mockMarcaCamionList[1];
const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const tipoCamion0 = mockTipoCamionList[0];
const tipoCamion1 = mockTipoCamionList[1];

export const mockCamionList: CamionList[] = [
  {
    placa: 'XXX111',
    estado: EstadoEnum.ACTIVO,
    pais_emisor_id: pais0.id,
    pais_emisor: pais0,
    pais_emisor_nombre: pais0.nombre,
    tipo_camion_id: tipoCamion0.id,
    tipo_camion: tipoCamion0,
    tipo_camion_descripcion: tipoCamion0.descripcion,
    chofer_id: chofer0.id,
    chofer: chofer0,
    chofer_nombre: chofer0.nombre,
    chofer_numero_documento: chofer0.numero_documento,
    marca_id: marca0.id,
    marca: marca0,
    marca_descripcion: marca0.descripcion,
  },
  {
    placa: 'YYY111',
    estado: EstadoEnum.ACTIVO,
    pais_emisor_id: pais1.id,
    pais_emisor: pais1,
    pais_emisor_nombre: pais1.nombre,
    tipo_camion_id: tipoCamion1.id,
    tipo_camion: tipoCamion1,
    tipo_camion_descripcion: tipoCamion1.descripcion,
    chofer_id: chofer1.id,
    chofer: chofer1,
    chofer_nombre: chofer1.nombre,
    chofer_numero_documento: chofer1.numero_documento,
    marca_id: marca1.id,
    marca: marca1,
    marca_descripcion: marca1.descripcion,
  },
];
