import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SemiClasificacionEnum } from 'src/app/enums/semi-clasificacion-enum';

export interface SemiClasificacion {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockSemiClasificacionList: SemiClasificacion[] = [
  {
    id: 1,
    descripcion: SemiClasificacionEnum.CARRETA_ABIERTA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: SemiClasificacionEnum.GRANELERO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: SemiClasificacionEnum.PLANCHA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: SemiClasificacionEnum.SIDER,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: SemiClasificacionEnum.TANQUE,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 6,
    descripcion: SemiClasificacionEnum.TANQUE_INOX,
    estado: EstadoEnum.ACTIVO,
  },
];
