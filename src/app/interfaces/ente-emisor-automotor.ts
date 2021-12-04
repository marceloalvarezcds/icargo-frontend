import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface EnteEmisorAutomotor {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockEnteEmisorAutomotorList: EnteEmisorAutomotor[] = [
  {
    id: 1,
    descripcion: 'Dirección del Registro de Automotores',
    estado: EstadoEnum.ACTIVO,
  },
];
