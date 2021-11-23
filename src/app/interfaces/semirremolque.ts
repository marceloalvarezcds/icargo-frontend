import { EstadoEnum } from '../enums/estado-enum';
import { MarcaSemi, mockMarcaSemiList } from './marca-semi';
import { mockPaisList, Pais } from './pais';
import { mockSemiClasificacionList, SemiClasificacion } from './semi-clasificacion';
import { mockTipoCamionList, TipoCamion } from './tipo-camion';
import { mockTipoCargaList, TipoCarga } from './tipo-carga';
import { mockTipoSemiList, TipoSemi } from './tipo-semi';

export interface Semirremolque {
  placa: string;
  estado: EstadoEnum;
  pais_emisor_id: number;
  pais_emisor: Pais;
  tipo_camion_id: number;
  tipo_camion: TipoCamion;
  marca_id: number;
  marca: MarcaSemi;
  clasificacion_id: number;
  clasificacion: SemiClasificacion;
  tipo_carga_id: number;
  tipo_carga: TipoCarga;
  tipo_semi_id: number;
  tipo_semi: TipoSemi;
}

export interface SemirremolqueList extends Semirremolque {
  pais_emisor_nombre: string;
  tipo_camion_descripcion: string;
  marca_descripcion: string;
  clasificacion_descripcion: string;
  tipo_carga_descripcion: string;
  tipo_semi_descripcion: string;
}

const marca0 = mockMarcaSemiList[0];
const marca1 = mockMarcaSemiList[1];
const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const semiClasificacion0 = mockSemiClasificacionList[0];
const semiClasificacion1 = mockSemiClasificacionList[1];
const tipoCamion0 = mockTipoCamionList[0];
const tipoCamion1 = mockTipoCamionList[1];
const tipoCarga0 = mockTipoCargaList[0];
const tipoCarga1 = mockTipoCargaList[1];
const tipoSemi0 = mockTipoSemiList[0];
const tipoSemi1 = mockTipoSemiList[1];

export const mockSemirremolqueList: SemirremolqueList[] = [
  {
    placa: 'XXX111',
    estado: EstadoEnum.ACTIVO,
    pais_emisor_id: pais0.id,
    pais_emisor: pais0,
    pais_emisor_nombre: pais0.nombre,
    tipo_camion_id: tipoCamion0.id,
    tipo_camion: tipoCamion0,
    tipo_camion_descripcion: tipoCamion0.descripcion,
    marca_id: marca0.id,
    marca: marca0,
    marca_descripcion: marca0.descripcion,
    clasificacion_id: semiClasificacion0.id,
    clasificacion: semiClasificacion0,
    clasificacion_descripcion: semiClasificacion0.descripcion,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
    tipo_carga_descripcion: tipoCarga0.descripcion,
    tipo_semi_id: tipoSemi0.id,
    tipo_semi: tipoSemi0,
    tipo_semi_descripcion: tipoSemi0.descripcion,
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
    marca_id: marca1.id,
    marca: marca1,
    marca_descripcion: marca1.descripcion,
    clasificacion_id: semiClasificacion1.id,
    clasificacion: semiClasificacion1,
    clasificacion_descripcion: semiClasificacion1.descripcion,
    tipo_carga_id: tipoCarga1.id,
    tipo_carga: tipoCarga1,
    tipo_carga_descripcion: tipoCarga1.descripcion,
    tipo_semi_id: tipoSemi1.id,
    tipo_semi: tipoSemi1,
    tipo_semi_descripcion: tipoSemi1.descripcion,
  },
];
