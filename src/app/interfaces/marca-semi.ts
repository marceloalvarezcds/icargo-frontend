import { EstadoEnum } from '../enums/estado-enum';
import { MarcaSemiEnum } from '../enums/marca-semi-enum';

export interface MarcaSemi {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockMarcaSemiList: MarcaSemi[] = [
  {
    id: 1,
    descripcion: MarcaSemiEnum.GUERRA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: MarcaSemiEnum.LIBRELATO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: MarcaSemiEnum.LUMAVIT,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: MarcaSemiEnum.METALURGICA_GUTIERREZ,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: MarcaSemiEnum.NOMA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 6,
    descripcion: MarcaSemiEnum.PHOENIX,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 7,
    descripcion: MarcaSemiEnum.RANDON,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 8,
    descripcion: MarcaSemiEnum.RODOVALE,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 9,
    descripcion: MarcaSemiEnum.TECNO_EQUIPO,
    estado: EstadoEnum.ACTIVO,
  },
];
