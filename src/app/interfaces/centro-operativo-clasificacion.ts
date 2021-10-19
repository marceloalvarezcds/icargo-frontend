import { EstadoEnum } from "../enums/estado-enum";

export interface CentroOperativoClasificacion {
  id: number;
  nombre: string;
  estado: EstadoEnum;
}

export const mockCentroOperativoClasificacionList: CentroOperativoClasificacion[] = [
  {
    id: 1,
    nombre: 'Silo',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    nombre: 'Puerto seco',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    nombre: 'Puerto multimodal',
    estado: EstadoEnum.ACTIVO,
  },
];
