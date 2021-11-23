import { EstadoEnum } from '../enums/estado-enum';
import { MarcaCamionEnum } from '../enums/marca-camion-enum';

export interface MarcaCamion {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockMarcaCamionList: MarcaCamion[] = [
  {
    id: 1,
    descripcion: MarcaCamionEnum.LUMAVIT,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: MarcaCamionEnum.MERCEDES_BENZ,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: MarcaCamionEnum.METALURGICA_GUTIERREZ,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: MarcaCamionEnum.PHOENIX,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: MarcaCamionEnum.SCANIA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 6,
    descripcion: MarcaCamionEnum.TECNO_EQUIPO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 7,
    descripcion: MarcaCamionEnum.VOLVO,
    estado: EstadoEnum.ACTIVO,
  },
];
