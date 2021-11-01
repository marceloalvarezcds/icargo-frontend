import { EstadoEnum } from '../enums/estado-enum';

export interface Cargo {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockCargoList: Cargo[] = [
  {
    id: 1,
    descripcion: 'Gerente',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Vendedor',
    estado: EstadoEnum.ACTIVO,
  },
];
